import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Item } from '../entity/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemDto } from '../dto/createItem.dto';
import { Order } from 'src/common/enum/order.enum';
import { UpdateItemDto } from '../dto/updateItem.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}
  // 상품 등록
  async createItem(createItemDto: CreateItemDto): Promise<Item> {
    const { item_name, item_price, description, category } = createItemDto;
    const newItem = this.itemRepository.create({
      item_name,
      item_price,
      description,
      category,
    });
    if (!newItem) {
      throw new InternalServerErrorException('상품 등록 실패');
    }
    return await this.itemRepository.save(newItem);
  }
  // 모든 상품 조회
  async getAllItems(
    sort: string,
    order: Order = Order.ASC,
    page: number = 1,
    size: number = 10,
    filter: { [key: string]: any },
  ) {
    const queryBuilder = this.itemRepository.createQueryBuilder('item');

    if (filter) {
      Object.keys(filter).forEach((key) => {
        if (Array.isArray(filter[key])) {
          queryBuilder.andWhere(`routine.${key} IN (:...${key})`, {
            [key]: filter[key],
          });
        } else {
          queryBuilder.andWhere(`routine.${key} = :${key}`, {
            [key]: filter[key],
          });
        }
      });
    }

    if (sort) {
      queryBuilder.orderBy(sort, order);
    }

    queryBuilder.skip((page - 1) * size).take(size);

    const items = await queryBuilder.getMany();

    return items;
  }
  // 상품 조회
  async getItemByKey(item_key: number): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ item_key });
    if (!item) {
      throw new Error('해당 아이템을 찾을 수 없습니다.');
    }
    return item;
  }

  async getItemByName(item_name: string): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ item_name });
    if (!item) {
      throw new NotFoundException('해당 아이템을 찾을 수 없습니다.');
    }
    return item;
  }
  // 상품 정보 수정
  async updateItem(updateItemDto: UpdateItemDto): Promise<Item> {
    const { item_key, item_name, item_price, description, category } =
      updateItemDto;
    const item = await this.itemRepository.findOneBy({ item_key });
    if (!item) {
      throw new NotFoundException('해당 아이템을 찾을 수 없습니다.');
    }
    item.item_name = item_name;
    item.item_price = item_price;
    item.description = description;
    item.category = category;
    return await this.itemRepository.save(item);
  }
  // 상품 평점 수정
  async updateItemRating(
    item_key: number,
    average_rating: number,
  ): Promise<void> {
    await this.itemRepository.update(item_key, { average_rating });
  }

  async searchItem(query: string): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder('item')
      .where('item.item_name LIKE :query', { query: `%${query}%` })
      .orWhere('item.brand_name LIKE :query', { query: `%${query}%` })
      .getMany();
  }
}
