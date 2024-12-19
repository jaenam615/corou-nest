import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from '../entity/order-detail.entity';
import { EntityManager, Repository } from 'typeorm';
import { ItemsService } from 'src/modules/items/service/items.service';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private readonly itemsService: ItemsService,
  ) {}

  async createOrderDetail(
    count: number,
    purchase_price: number,
    item_key: number,
    order_key: number,
    transactionalEntityManager: EntityManager,
  ): Promise<OrderDetail> {
    const item = await this.itemsService.getItemByKey(item_key);
    if (!item) {
      throw new Error('해당 상품을 찾을 수 없습니다.');
    }

    const newOrderDetail = this.orderDetailRepository.create({
      item_key,
      order_key,
      count,
      purchase_price,
    });
    return transactionalEntityManager.save(OrderDetail, newOrderDetail);
  }

  async getAllOrderDetail(order_key: number): Promise<OrderDetail[]> {
    const orderDetails = await this.orderDetailRepository.find({
      where: { item_order: { order_key } },
    });
    if (!orderDetails.length) {
      throw new Error('해당 주문 정보를 찾을 수 없습니다.');
    }
    return orderDetails;
  }
}
