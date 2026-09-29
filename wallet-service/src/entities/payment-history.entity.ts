import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum PaymentAction {
  PURCHASE = 'purchase',
  REFUND = 'refund',
  TOP_UP = 'top_up',
}

@Entity('payment_history')
@Index('idx_payment_history_user_ts', ['userId', 'ts'])
export class PaymentHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: PaymentAction,
    nullable: false,
  })
  action: PaymentAction;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  amount: string;

  @CreateDateColumn({ type: 'timestamptz' })
  ts: Date;
}
