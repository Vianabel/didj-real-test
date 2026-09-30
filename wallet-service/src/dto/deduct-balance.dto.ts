import { IsNumber, IsPositive } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeductBalanceDto {
  @ApiProperty({ example: 100, description: 'Сумма списания' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'сумма платежа должна быть числом с не более чем 2 знаками после запятой',
    },
  )
  @IsPositive({ message: 'сумма платежа должна быть положительной' })
  amount: number;
}
