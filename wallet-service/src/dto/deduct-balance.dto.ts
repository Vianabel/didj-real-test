import { IsNumber, IsPositive } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeductBalanceDto {
  @ApiProperty({ example: 100, description: 'Сумма списания' })
  @IsNumber({}, { message: 'сумма платежа должна быть числом' })
  @IsPositive({ message: 'сумма платежа должна быть положительной' })
  amount: number;
}
