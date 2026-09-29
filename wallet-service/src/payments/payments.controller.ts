import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { DeductBalanceDto } from '../dto/deduct-balance.dto';
import { PaymentAction } from '../entities/payment-history.entity';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('/users/:id/payments')
  public async user(
    @Param('id') id: string,
    @Body() dto: DeductBalanceDto,
  ): Promise<{ balance: string }> {
    return this.paymentsService.deduct(+id, dto);
  }

  @Get('/users/:id/balance')
  public async balance(@Param('id') id: string): Promise<{ balance: string }> {
    return this.paymentsService.getBalance(+id);
  }

  @Get('/users/:id/payments')
  public async payment(
    @Param('id') id: string,
  ): Promise<
    { id: number; action: PaymentAction; amount: string; ts: Date }[]
  > {
    return this.paymentsService.getHistory(+id);
  }
}
