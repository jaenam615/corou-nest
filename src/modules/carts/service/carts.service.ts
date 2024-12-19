import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../entity/cart.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async addToCart(
    user_key: number,
    item_key: number,
    quantity: number,
  ): Promise<Cart> {
    const existingItem = await this.cartRepository.findOne({
      where: { user_key, item_key },
    });
    if (existingItem) {
      existingItem.quantity += quantity;
      return this.cartRepository.save(existingItem);
    }
    const cart = this.cartRepository.create({ user_key, item_key, quantity });
    return this.cartRepository.save(cart);
  }

  async getCart(user_key: number): Promise<Cart[]> {
    return this.cartRepository.find({
      where: { user_key },
      relations: ['item'],
    });
  }

  async deleteCart(cart_key: number): Promise<void> {
    await this.cartRepository.delete({ cart_key });
  }

  async deleteAllCart(user_key: number): Promise<void> {
    await this.cartRepository.delete({ user_key });
  }

  async updateCart(cart_key: number, quantity: number): Promise<void> {
    await this.cartRepository.update(cart_key, { quantity });
  }
}
