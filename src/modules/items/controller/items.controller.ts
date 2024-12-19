import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ItemsService } from '../service/items.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateItemDto } from '../dto/createItem.dto';
import { Order } from '../../../common/enum/order.enum';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({
    summary: '아이템 등록',
    description: '아이템을 등록합니다.',
  })
  async createItem(@Body() body: CreateItemDto) {
    try {
      const item = await this.itemsService.createItem(body);
      return {
        success: true,
        message: '아이템 등록에 성공했습니다.',
        data: item,
      };
    } catch (error) {
      return {
        success: false,
        message: '아이템 등록에 실패했습니다.',
      };
    }
  }

  @Get()
  @ApiOperation({
    summary: '모든 아이템 조회',
    description: '모든 아이템을 조회합니다.',
  })
  async getAllItems(
    @Query('sort') sort: string,
    @Query('order') order: Order,
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('filter') filter: { [key: string]: any },
  ) {
    try {
      const items = await this.itemsService.getAllItems(
        sort,
        order,
        page,
        size,
        filter,
      );
      return {
        success: true,
        message: '모든 아이템 조회에 성공했습니다.',
        data: items,
      };
    } catch (error) {
      return {
        success: false,
        message: '모든 아이템 조회에 실패했습니다.',
      };
    }
  }

  @Get('search')
  @ApiOperation({
    summary: '아이템 검색',
    description: '아이템을 검색합니다.',
  })
  async searchItems(@Query('keyword') keyword: string) {
    try {
      const items = await this.itemsService.searchItem(keyword);
      return {
        success: true,
        message: '아이템 검색에 성공했습니다.',
        data: items,
      };
    } catch (error) {
      return {
        success: false,
        message: '아이템 검색에 실패했습니다.',
      };
    }
  }
}
