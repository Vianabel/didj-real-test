import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { PaymentHistory } from '../entities/payment-history.entity';
import { PaymentsRepository } from './payments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, PaymentHistory])],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository],
})
export class PaymentsModule {}
