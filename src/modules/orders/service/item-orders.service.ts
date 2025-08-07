import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressesService } from 'src/modules/addresses/services/addresses.service';
import { CartsService } from 'src/modules/carts/service/carts.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { DataSource, Repository } from 'typeorm';

import { ItemOrder } from '../entity/item-order.entity';
import { OrderDetailsService } from './order-details.service';

@Injectable()
export class ItemOrdersService {
  constructor(
    @InjectRepository(ItemOrder)
    private itemOrderRepository: Repository<ItemOrder>,
    private usersService: UsersService,
    private addressesService: AddressesService,
    private orderDetailService: OrderDetailsService,
    private cartService: CartsService,
    private dataSource: DataSource,
  ) {}

  // 주문 생성
  async createItemOrder(
    user_key: number,
    addr_key: number,
    price_total: number,
    items: Array<{ count: number; purchase_price: number; item_key: number }>,
  ): Promise<ItemOrder> {
    const user = await this.usersService.findOneByKey(user_key);
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }
    const address = await this.addressesService.getOneAddress(
      user_key,
      addr_key,
    );
    if (!address) {
      throw new NotFoundException('해당 주소를 찾을 수 없습니다.');
    }

    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const newItemOrder = await transactionalEntityManager.save(ItemOrder, {
        user,
        address,
        order_at: new Date(),
        status: 'ORDERED',
        price_total,
        order_details: [],
      });
      for (const item of items) {
        const orderDetail = await this.orderDetailService.createOrderDetail(
          item.count,
          item.purchase_price,
          item.item_key,
          newItemOrder.order_key,
          transactionalEntityManager,
        );
        newItemOrder.order_details.push(orderDetail);
      }
      await this.cartService.deleteAllCart(user_key);

      return newItemOrder;
    });
  }

  // 사용자 주문 조회
  async getItemOrderByUser(user_key: number): Promise<ItemOrder[]> {
    const itemOrders = await this.itemOrderRepository.find({
      where: { user: { user_key } },
    });

    return itemOrders;
  }

  // 주문 조회 by key
  async getItemOrderByKey(
    order_key: number,
    user_key: number,
  ): Promise<ItemOrder> {
    console.log(user_key);
    const itemOrder = await this.itemOrderRepository.findOne({
      where: { order_key },
      relations: ['order_details'],
    });
    if (!itemOrder) {
      throw new NotFoundException('주문을 찾을 수 없습니다.');
    }
    return itemOrder;
  }

  // 주문 상태 변경
  async changeOrderStatus(
    order_key: number,
    status: 'ORDERED' | 'CANCELLED' | 'DELIVERED',
  ): Promise<ItemOrder> {
    const itemOrder = await this.itemOrderRepository.findOne({
      where: { order_key },
    });
    if (!itemOrder) {
      throw new NotFoundException('주문을 찾을 수 없습니다.');
    }
    itemOrder.status = status;
    return await this.itemOrderRepository.save(itemOrder);
  }
}
