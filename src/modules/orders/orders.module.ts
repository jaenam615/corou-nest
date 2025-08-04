import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';

import { AddressesModule } from '../addresses/addresses.module';
import { Address } from '../addresses/entity/address.entity';
import { CartsModule } from '../carts/carts.module';
import { Cart } from '../carts/entity/cart.entity';
import { Item } from '../items/entity/item.entity';
import { ItemsModule } from '../items/items.module';
import { UsersModule } from '../users/users.module';
import { OrdersController } from './controller/orders.controller';
import { ItemOrder } from './entity/item-order.entity';
import { OrderDetail } from './entity/order-detail.entity';
import { ItemOrdersService } from './service/item-orders.service';
import { OrderDetailsService } from './service/order-details.service';

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
