import { Module } from '@nestjs/common';
import { OrderDetailsService } from './service/order-details.service';
import { ItemOrdersService } from './service/item-orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ItemsModule } from '../items/items.module';
import { CartsModule } from '../carts/carts.module';
import { User } from '../users/entity/user.entity';
import { OrderDetail } from './entity/order-detail.entity';
import { ItemOrder } from './entity/item-order.entity';
import { Item } from '../items/entity/item.entity';
import { Cart } from '../carts/entity/cart.entity';
import { Address } from '../addresses/entity/address.entity';
import { OrdersController } from './controller/orders.controller';
import { AddressesModule } from '../addresses/addresses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Item,
      Cart,
      OrderDetail,
      ItemOrder,
      Address,
    ]),
    UsersModule,
    ItemsModule,
    CartsModule,
    AddressesModule,
  ],
  providers: [OrderDetailsService, ItemOrdersService],
  exports: [OrderDetailsService, ItemOrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
