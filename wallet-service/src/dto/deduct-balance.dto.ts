import { IsNumber, IsPositive } from '@nestjs/class-validator';

export class DeductBalanceDto {
  @IsNumber()
  @IsPositive()
  amount: number;
}
