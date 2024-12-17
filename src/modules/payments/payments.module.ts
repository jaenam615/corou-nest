import { Module } from '@nestjs/common';
import { PortoneService } from './service/portone.service';
import { PaymentsController } from './controller/payments.controller';

@Module({
  providers: [PortoneService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
