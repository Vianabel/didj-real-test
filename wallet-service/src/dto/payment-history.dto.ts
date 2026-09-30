import { ApiProperty } from '@nestjs/swagger';
import { PaymentAction } from '../entities/payment-history.entity';

export class PaymentHistoryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ enum: PaymentAction, example: PaymentAction.PURCHASE })
  action: PaymentAction;

  @ApiProperty({ example: '50.00' })
  amount: string;

  @ApiProperty({ example: '2026-09-30T12:00:00.000Z' })
  ts: Date;
}
