import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';
import { DeductBalanceDto } from '../dto/deduct-balance.dto';
import { User } from '../entities/user.entity';
import {
  PaymentAction,
  PaymentHistory,
} from '../entities/payment-history.entity';

@Injectable()
export class PaymentsService implements OnModuleInit {
  constructor(private readonly repository: PaymentsRepository) {}

  async onModuleInit(): Promise<void> {
    const userId = 1;
    const initialAmount = 500;

    const user = await this.repository.findUser(userId);
    if (!user) {
      await this.repository.createUserWithTopUp(userId, initialAmount);
    }
  }

  async deduct(
    userId: number,
    dto: DeductBalanceDto,
  ): Promise<{ balance: string }> {
    const amount = dto.amount.toFixed(2);

    const newBalance: string | null = await this.repository.deduct(
      userId,
      amount,
    );
    if (newBalance === null) {
      throw new NotFoundException(`User ${userId} does not found`);
    }
    return { balance: newBalance };
  }

  async getBalance(userId: number): Promise<{ balance: string }> {
    const user: User | null = await this.repository.findUser(userId);

    if (!user) {
      throw new NotFoundException(`User ${userId} does not found`);
    }

    return { balance: user.balance };
  }

  async getHistory(
    userId: number,
  ): Promise<
    { id: number; action: PaymentAction; amount: string; ts: Date }[]
  > {
    const payments: PaymentHistory[] = await this.repository.getHistory(userId);

    return payments.map((p) => ({
      id: p.id,
      action: p.action,
      amount: p.amount,
      ts: p.ts,
    }));
  }
}
