import { ApiProperty } from '@nestjs/swagger';

export class BalanceDto {
  @ApiProperty({
    example: '450.00',
    description: 'Текущий баланс пользователя',
  })
  balance: string;
}
