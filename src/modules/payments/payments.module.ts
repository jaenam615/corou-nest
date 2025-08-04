import { Module } from '@nestjs/common';

import { PaymentsController } from './controller/payments.controller';
import { PortoneService } from './service/portone.service';

@Module({
  providers: [PortoneService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
