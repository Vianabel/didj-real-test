import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentsRepository } from '../../../src/payments/payments.repository';
import { DeductBalanceDto } from '../../../src/dto/deduct-balance.dto';
import { PaymentAction } from '../../../src/entities/payment-history.entity';
import { PaymentsService } from '../../../src/payments/payments.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  const repository = {
    deduct: jest.fn(),
    findUser: jest.fn(),
    getHistory: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PaymentsService(repository as unknown as PaymentsRepository);
  });

  describe('deduct', () => {
    const dto: DeductBalanceDto = { amount: 50 };

    it('возвращает новый баланс при успешном списании', async () => {
      repository.deduct.mockResolvedValue('50.00');

      const result = await service.deduct(1, dto);
      expect(result).toEqual({ balance: '50.00' });
      expect(repository.deduct).toHaveBeenCalledWith(1, '50.00');
    });

    it('кидает NotFoundException, если юзера нет (deduct вернул null)', async () => {
      repository.deduct.mockResolvedValue(null);

      await expect(service.deduct(1, dto)).rejects.toThrow(NotFoundException);
    });

    it('кидает BadRequestException, если средств недостаточно', async () => {
      repository.deduct.mockRejectedValue(
        new BadRequestException('Insufficient balance'),
      );

      await expect(service.deduct(1, dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getBalance', () => {
    it('возвращает баланс, если юзер найден', async () => {
      repository.findUser.mockResolvedValue({ id: 1, balance: '100.00' });

      const result = await service.getBalance(1);
      expect(result).toEqual({ balance: '100.00' });
    });

    it('кидает NotFoundException, если юзера нет', async () => {
      repository.findUser.mockResolvedValue(null);

      await expect(service.getBalance(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getHistory', () => {
    it('возвращает массив плоских объектов истории без поля user', async () => {
      repository.getHistory.mockResolvedValue([
        {
          id: 1,
          userId: 1,
          action: PaymentAction.TOP_UP,
          amount: '100.00',
          ts: new Date('2026-01-01T00:00:00Z'),
          user: { id: 1 },
        },
        {
          id: 2,
          userId: 1,
          action: PaymentAction.PURCHASE,
          amount: '50.00',
          ts: new Date('2026-01-02T00:00:00Z'),
          user: { id: 1 },
        },
      ]);

      const result = await service.getHistory(1);

      expect(result).toEqual([
        expect.objectContaining({ id: 1, action: PaymentAction.TOP_UP }),
        expect.objectContaining({ id: 2, action: PaymentAction.PURCHASE }),
      ]);
      expect(result[0]).not.toHaveProperty('user');
    });
  });
});
