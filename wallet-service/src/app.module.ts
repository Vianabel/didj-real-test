import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentsModule } from './payments/payments.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('POSTGRES_HOST'),
        port: parseInt(configService.getOrThrow<string>('POSTGRES_PORT'), 10),
        username: configService.getOrThrow<string>('POSTGRES_USER'),
        password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
        database: configService.getOrThrow<string>('POSTGRES_DB'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    PaymentsModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
