import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { AddressesService } from './addresses.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { Address } from 'src/modules/addresses/entities/address.entity';
import { BaseAddressDto } from '../dto/baseAddress.dto';
import { User } from 'src/modules/users/entities/user.entity';

const mockUser = { user_key: 1 } as User;
const mockAddress: Address = {
  address_key: 1,
  address_name: '집',
  name: '홍길동',
  addr: '서울시',
  addr_detail: '101호',
  zip: '12345',
  tel: '01012345678',
  request: '문앞에 놔주세요',
  is_default: 'Y',
  user: mockUser,
};

const mockAddressDto: BaseAddressDto = {
  address_name: '회사',
  name: '홍길동',
  addr: '서울시 강남구',
  addr_detail: '302호',
  zip: '54321',
  tel: '01087654321',
  request: '경비실에 맡겨주세요',
  is_default: 'Y',
};

describe('AddressesService', () => {
  let service: AddressesService;
  let addressRepo: Repository<Address>;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        {
          provide: getRepositoryToken(Address),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockResolvedValue(mockAddress),
            find: jest.fn().mockResolvedValue([mockAddress]),
            findOneBy: jest.fn().mockResolvedValue(mockAddress),
            update: jest.fn().mockResolvedValue(undefined),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOneByKey: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<AddressesService>(AddressesService);
    addressRepo = module.get<Repository<Address>>(getRepositoryToken(Address));
    usersService = module.get<UsersService>(UsersService);
  });

  describe('addAddress', () => {
    it('should add and return a new address', async () => {
      const result = await service.addAddress(1, mockAddressDto);

      expect(usersService.findOneByKey).toHaveBeenCalledWith(1);
      expect(addressRepo.update).toHaveBeenCalled(); // is_default 처리
      expect(addressRepo.create).toHaveBeenCalledWith({
        ...mockAddressDto,
        user: mockUser,
      });
      expect(addressRepo.save).toHaveBeenCalled();
      expect(result).toEqual(mockAddress);
    });

    it('should throw if user not found', async () => {
      jest.spyOn(usersService, 'findOneByKey').mockResolvedValue(null);
      await expect(service.addAddress(1, mockAddressDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllAddress', () => {
    it('should return all addresses of the user', async () => {
      const result = await service.getAllAddress(1);
      expect(addressRepo.find).toHaveBeenCalledWith({
        where: { user: { user_key: 1 } },
      });
      expect(result).toEqual([mockAddress]);
    });
  });

  describe('getOneAddress', () => {
    it('should return a single address', async () => {
      const result = await service.getOneAddress(1, 1);
      expect(addressRepo.findOneBy).toHaveBeenCalledWith({ address_key: 1 });
      expect(result).toEqual(mockAddress);
    });

    it('should throw if address not found', async () => {
      jest.spyOn(addressRepo, 'findOneBy').mockResolvedValue(null);
      await expect(service.getOneAddress(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateAddress', () => {
    it('should update and return the address', async () => {
      const result = await service.updateAddress(1, 1, mockAddressDto);

      expect(addressRepo.findOneBy).toHaveBeenCalledWith({ address_key: 1 });
      expect(addressRepo.update).toHaveBeenCalled();
      expect(addressRepo.save).toHaveBeenCalled();
      expect(result).toEqual(mockAddress);
    });

    it('should throw if address not found', async () => {
      jest.spyOn(addressRepo, 'findOneBy').mockResolvedValue(null);
      await expect(service.updateAddress(1, 1, mockAddressDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteAddress', () => {
    it('should delete the address', async () => {
      await service.deleteAddress(1);
      expect(addressRepo.findOneBy).toHaveBeenCalledWith({ address_key: 1 });
      expect(addressRepo.remove).toHaveBeenCalledWith(mockAddress);
    });

    it('should throw if address not found', async () => {
      jest.spyOn(addressRepo, 'findOneBy').mockResolvedValue(null);
      await expect(service.deleteAddress(1)).rejects.toThrow(NotFoundException);
    });
  });
});
