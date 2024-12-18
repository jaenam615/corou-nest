import { Module } from '@nestjs/common';
import { OrderDetailsService } from './service/order-details/order-details.service';
import { ItemOrdersService } from './service/item-orders/item-orders.service';

@Module({
  providers: [OrderDetailsService, ItemOrdersService]
})
export class OrdersModule {}
