import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartsService } from '../service/carts.service';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AddToCartDto } from '../dto/addToCart.dto';
import { UpdateCartDto } from '../dto/updateCart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '장바구니 조회' })
  async getCart(@Request() req) {
    const user_key = req.user.user_key;
    if (!user_key) {
      return {
        success: false,
        message: '유효하지 않은 사용자입니다.',
      };
    }
    try {
      const cart = this.cartsService.getCart(user_key);
      return {
        success: true,
        message: '장바구니 조회 성공',
        data: cart,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : '서버 오류가 발생했습니다.',
      };
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '장바구니 추가' })
  async addToCart(@Request() req, @Body() body: AddToCartDto) {
    const user_key = req.user.user_key;
    if (!user_key) {
      return {
        success: false,
        message: '유효하지 않은 사용자입니다.',
      };
    }
    const { item_key, quantity } = body;
    try {
      const cart = this.cartsService.addToCart(user_key, item_key, quantity);
      return {
        success: true,
        message: '장바구니 추가 성공',
        data: cart,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : '장바구니 추가에 실패했습니다.',
      };
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '장바구니 수정' })
  async updateCart(@Request() req, @Body() body: UpdateCartDto) {
    const user_key = req.user.user_key;
    if (!user_key) {
      return {
        success: false,
        message: '유효하지 않은 사용자입니다.',
      };
    }
    const { cart_key, quantity } = body;
    try {
      await this.cartsService.updateCart(cart_key, quantity);
      return {
        success: true,
        message: '장바구니 수정 성공',
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : '장바구니 업데이트에 실패했습니다.',
      };
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '장바구니 삭제' })
  async deleteCart(@Request() req, @Body() body: { cart_key: number }) {
    const user_key = req.user.user_key;
    if (!user_key) {
      return {
        success: false,
        message: '유효하지 않은 사용자입니다.',
      };
    }
    const { cart_key } = body;
    try {
      await this.cartsService.deleteCart(cart_key);
      return {
        success: true,
        message: '장바구니 삭제 성공',
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : '장바구니 삭제에 실패했습니다.',
      };
    }
  }
}
