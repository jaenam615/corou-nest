import { Module } from '@nestjs/common';
import { CartsService } from './service/carts.service';
import { CartsController } from './controller/carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), UsersModule],
  providers: [CartsService],
  exports: [CartsService],
  controllers: [CartsController],
})
export class CartsModule {}
