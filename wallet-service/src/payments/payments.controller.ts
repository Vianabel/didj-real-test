import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { DeductBalanceDto } from '../dto/deduct-balance.dto';
import { BalanceDto } from '../dto/balance.dto';
import { PaymentHistoryDto } from '../dto/payment-history.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('payments')
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Списание баланса пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Операция успешна',
    type: BalanceDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректная сумма или недостаточно средств',
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @Post('/users/:id/payments')
  public async deduct(
    @Param('id') id: string,
    @Body() dto: DeductBalanceDto,
  ): Promise<BalanceDto> {
    return this.paymentsService.deduct(+id, dto);
  }

  @ApiOperation({ summary: 'Просмотр баланса' })
  @ApiResponse({
    status: 200,
    description: 'Операция успешна',
    type: BalanceDto,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @Get('/users/:id/balance')
  public async balance(@Param('id') id: string): Promise<BalanceDto> {
    return this.paymentsService.getBalance(+id);
  }

  @ApiOperation({ summary: 'Просмотр истории операций' })
  @ApiResponse({
    status: 200,
    description: 'Операция успешна',
    type: [PaymentHistoryDto],
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @Get('/users/:id/payments')
  public async history(@Param('id') id: string): Promise<PaymentHistoryDto[]> {
    return this.paymentsService.getHistory(+id);
  }
}
