import { Module } from '@nestjs/common';
import { CartsService } from './service/carts.service';
import { CartsController } from './controller/carts.controller';

@Module({
  providers: [CartsService],
  exports: [CartsService],
  controllers: [CartsController],
})
export class CartsModule {}
