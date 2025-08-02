import { Repository } from 'typeorm';
import { Address } from '../entity/address.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { BaseAddressDto } from '../dto/baseAddress.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    private usersService: UsersService,
  ) {}

  // 사용자 주소 추가
  async addAddress(
    user_key: number,
    baseAddressDto: BaseAddressDto,
  ): Promise<Address> {
    const {
      address_name,
      name,
      addr,
      addr_detail,
      zip,
      tel,
      request,
      is_default,
    } = baseAddressDto;
    const foundUser = await this.usersService.findOneByKey(user_key);
    if (!foundUser) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }
    if (is_default === 'Y') {
      await this.addressRepository.update(
        { user: foundUser },
        { is_default: 'N' },
      );
    }
    const newAddress = this.addressRepository.create({
      user: foundUser,
      address_name,
      name,
      addr,
      addr_detail,
      zip,
      tel,
      request,
      is_default,
    });
    return await this.addressRepository.save(newAddress);
  }

  // 사용자 주소록 조회
  async getAllAddress(user_key: number): Promise<Address[]> {
    const addresses = await this.addressRepository.find({
      where: { user: { user_key } },
    });

    return addresses;
  }

  // 사용자 주소 조회
  async getOneAddress(user_key: number, address_key: number): Promise<Address> {
    const address = await this.addressRepository.findOneBy({ address_key });
    if (!address) {
      throw new NotFoundException('해당 주소를 찾을 수 없습니다.');
    }
    return address;
  }

  // 사용자 주소 수정
  async updateAddress(
    user_key: number,
    address_key: number,
    baseAddressDto: BaseAddressDto,
  ): Promise<Address> {
    const {
      address_name,
      name,
      addr,
      addr_detail,
      zip,
      tel,
      request,
      is_default,
    } = baseAddressDto;
    const address = await this.addressRepository.findOneBy({ address_key });
    if (!address) {
      throw new NotFoundException('해당 주소를 찾을 수 없습니다.');
    }
    if (is_default === 'Y') {
      await this.addressRepository.update(
        { user: { user_key }, is_default: 'Y' },
        { is_default: 'N' },
      );
    }
    address.address_name = address_name;
    address.name = name;
    address.addr = addr;
    address.addr_detail = addr_detail;
    address.zip = zip;
    address.tel = tel;
    address.request = request;
    address.is_default = is_default;
    return await this.addressRepository.save(address);
  }

  // 사용자 주소 삭제
  async deleteAddress(address_key: number): Promise<void> {
    const address = await this.addressRepository.findOneBy({ address_key });
    if (!address) {
      throw new NotFoundException('해당 주소를 찾을 수 없습니다.');
    }
    await this.addressRepository.remove(address);
    return;
  }
}
