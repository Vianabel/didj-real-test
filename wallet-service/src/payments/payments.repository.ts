import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaymentAction,
  PaymentHistory,
} from '../entities/payment-history.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectRepository(PaymentHistory)
    private readonly paymentHistoryRepository: Repository<PaymentHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async findUser(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async getHistory(userId: number): Promise<PaymentHistory[]> {
    return this.paymentHistoryRepository.find({
      where: { userId: userId },
      order: { ts: 'DESC' },
    });
  }

  async deduct(userId: number, amount: string): Promise<string | null> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const user: User | null = await manager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!user) return null;

      if (parseFloat(user.balance) < parseFloat(amount)) {
        throw new BadRequestException('Insufficient balance');
      }

      await manager.insert(PaymentHistory, {
        userId,
        action: PaymentAction.PURCHASE,
        amount,
      });

      const result = await manager.query<{ sum: string }[]>(
        `SELECT COALESCE(SUM(
                    CASE action
                      WHEN 'top_up' THEN amount
                      WHEN 'refund' THEN amount
                      ELSE -amount
                    END
                ), 0) AS SUM
                FROM payment_history
                WHERE "userId" = $1`,
        [userId],
      );

      const sum: string = result[0]?.sum ?? '0';

      await manager.update(User, { id: userId }, { balance: sum });

      return sum;
    });
  }
}
