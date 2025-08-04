import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { CartsController } from './controller/carts.controller';
import { Cart } from './entity/cart.entity';
import { CartsService } from './service/carts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), UsersModule],
  providers: [CartsService],
  exports: [CartsService],
  controllers: [CartsController],
})
export class CartsModule {}
