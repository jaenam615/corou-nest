import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/modules/users/services/users.service';
import { Repository } from 'typeorm';

import { BaseAddressDto } from '../dto/baseAddress.dto';
import { Address } from 'src/modules/addresses/entities/address.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly usersService: UsersService,
  ) {}

  private async findUserOrThrow(user_key: number) {
    const user = await this.usersService.findOneByKey(user_key);
    if (!user) throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    return user;
  }

  private async findAddressOrThrow(address_key: number) {
    const address = await this.addressRepository.findOneBy({ address_key });
    if (!address) throw new NotFoundException('해당 주소를 찾을 수 없습니다.');
    return address;
  }

  async addAddress(user_key: number, dto: BaseAddressDto): Promise<Address> {
    const user = await this.findUserOrThrow(user_key);

    if (dto.is_default === 'Y') {
      await this.addressRepository.update({ user }, { is_default: 'N' });
    }

    const newAddress = this.addressRepository.create({
      ...dto,
      user,
    });

    return this.addressRepository.save(newAddress);
  }

  async getAllAddress(user_key: number): Promise<Address[]> {
    return this.addressRepository.find({
      where: { user: { user_key } },
    });
  }

  async getOneAddress(
    _user_key: number,
    address_key: number,
  ): Promise<Address> {
    return this.findAddressOrThrow(address_key);
  }

  async updateAddress(
    user_key: number,
    address_key: number,
    dto: BaseAddressDto,
  ): Promise<Address> {
    const address = await this.findAddressOrThrow(address_key);

    if (dto.is_default === 'Y') {
      await this.addressRepository.update(
        { user: { user_key }, is_default: 'Y' },
        { is_default: 'N' },
      );
    }

    Object.assign(address, dto);
    return this.addressRepository.save(address);
  }

  async deleteAddress(address_key: number): Promise<void> {
    const address = await this.findAddressOrThrow(address_key);
    await this.addressRepository.remove(address);
  }
}
