import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { AddressesService } from '../services/addresses.service';
import { BaseAddressDto } from '../dto/baseAddress.dto';
import { Address } from '../entities/address.entity';

@Controller('user/:user_key/address')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  async addAddress(
    @Param('user_key', ParseIntPipe) user_key: number,
    @Body() dto: BaseAddressDto,
  ): Promise<Address> {
    return this.addressesService.addAddress(user_key, dto);
  }

  @Get()
  async getAllAddress(
    @Param('user_key', ParseIntPipe) user_key: number,
  ): Promise<Address[]> {
    return this.addressesService.getAllAddress(user_key);
  }

  @Get(':addr_key')
  async getOneAddress(
    @Param('user_key', ParseIntPipe) user_key: number,
    @Param('addr_key', ParseIntPipe) addr_key: number,
  ): Promise<Address> {
    return this.addressesService.getOneAddress(user_key, addr_key);
  }

  @Patch(':addr_key')
  async updateAddress(
    @Param('user_key', ParseIntPipe) user_key: number,
    @Param('addr_key', ParseIntPipe) addr_key: number,
    @Body() dto: BaseAddressDto,
  ): Promise<Address> {
    return this.addressesService.updateAddress(user_key, addr_key, dto);
  }

  @Delete(':addr_key')
  async deleteAddress(
    @Param('addr_key', ParseIntPipe) addr_key: number,
  ): Promise<{ message: string }> {
    await this.addressesService.deleteAddress(addr_key);
    return { message: '배송지가 삭제되었습니다.' };
  }
}
