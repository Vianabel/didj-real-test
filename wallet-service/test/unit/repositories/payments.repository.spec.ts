import { BadRequestException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PaymentsRepository } from '../../../src/payments/payments.repository';
import { PaymentHistory } from '../../../src/entities/payment-history.entity';
import { User } from '../../../src/entities/user.entity';

describe('PaymentsRepository', () => {
  let repository: PaymentsRepository;

  const manager = {
    findOne: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    query: jest.fn(),
  };
  const dataSource = {
    transaction: jest.fn(async (cb: (m: typeof manager) => Promise<unknown>) =>
      cb(manager),
    ),
  };

  const userRepository = { findOne: jest.fn() };
  const paymentHistoryRepository = { find: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PaymentsRepository(
      paymentHistoryRepository as unknown as Repository<PaymentHistory>,
      userRepository as unknown as Repository<User>,
      dataSource as unknown as DataSource,
    );
  });

  describe('findUser', () => {
    it('делегирует в userRepository.findOne', async () => {
      userRepository.findOne.mockResolvedValue({ id: 1, balance: '100.00' });
      const user = await repository.findUser(1);
      expect(user).toEqual({ id: 1, balance: '100.00' });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('getHistory', () => {
    it('делегирует в paymentHistoryRepository.find с сортировкой', async () => {
      paymentHistoryRepository.find.mockResolvedValue([]);
      await repository.getHistory(1);
      expect(paymentHistoryRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        order: { ts: 'DESC' },
      });
    });
  });

  describe('deduct', () => {
    it('кидает BadRequestException при нехватке средств', async () => {
      manager.findOne.mockResolvedValue({ id: 1, balance: '10.00' });

      await expect(repository.deduct(1, '50.00')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('возвращает null, если юзер не найден', async () => {
      manager.findOne.mockResolvedValue(null);

      const result = await repository.deduct(1, '50.00');
      expect(result).toBeNull();
    });

    it('возвращает новый баланс после успешного списания', async () => {
      manager.findOne.mockResolvedValue({ id: 1, balance: '500.00' });
      manager.query = jest.fn().mockResolvedValue([{ sum: '450.00' }]);

      const result = await repository.deduct(1, '50.00');
      expect(result).toBe('450.00');
      expect(manager.insert).toHaveBeenCalled();
      expect(manager.update).toHaveBeenCalledWith(
        User,
        { id: 1 },
        { balance: '450.00' },
      );
    });
  });
});
