import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ItemOrdersService } from '../service/item-orders.service';
import { OrderDetailsService } from '../service/order-details.service';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateOrderDto } from '../dto/createOrder.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly itemOrdersService: ItemOrdersService) {}

  @Get('/:order_key')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '주문 조회' })
  async getOrderByKey(@Request() req, @Param('order_key') order_key: number) {
    const user_key = req.user.user_key;
    if (!user_key) {
      return {
        success: false,
        message: '유효하지 않은 사용자입니다.',
      };
    }
    try {
      const order = await this.itemOrdersService.getItemOrderByKey(
        order_key,
        user_key,
      );
      return {
        success: true,
        message: '주문 조회 성공',
        data: order,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : '서버 오류가 발생했습니다.',
      };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '모든 주문 조회' })
  async getOrderByUser(@Request() req) {
    const user_key = req.user.user_key;
    if (!user_key) {
      return {
        success: false,
        message: '유효하지 않은 사용자입니다.',
      };
    }
    try {
      const orders = await this.itemOrdersService.getItemOrderByUser(user_key);
      return {
        success: true,
        message: '모든 주문 조회 성공',
        data: orders,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : '주문 조회에 실패했습니다.',
      };
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '주문 추가' })
  async createOrder(@Request() req, @Body() body: CreateOrderDto) {
    const user_key = req.user.user_key;
    if (!user_key) {
      return {
        success: false,
        message: '유효하지 않은 사용자입니다.',
      };
    }
    const { address_key, price_total, items } = body;
    try {
      const order = await this.itemOrdersService.createItemOrder(
        user_key,
        address_key,
        price_total,
        items,
      );
      return {
        success: true,
        message: '주문 생성성 성공',
        data: order,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : '주문 생성에 실패했습니다.',
      };
    }
  }
}
