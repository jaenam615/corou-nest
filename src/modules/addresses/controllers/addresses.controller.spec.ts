import { AddressesController } from './addresses.controller';
import { AddressesService } from '../services/addresses.service';
import { BaseAddressDto } from '../dto/baseAddress.dto';
import { Address } from '../entities/address.entity';

describe('AddressesController (Unit)', () => {
  let controller: AddressesController;
  let service: jest.Mocked<AddressesService>;

  beforeEach(() => {
    service = {
      addAddress: jest.fn(),
      getAllAddress: jest.fn(),
      getOneAddress: jest.fn(),
      updateAddress: jest.fn(),
      deleteAddress: jest.fn(),
    } as unknown as jest.Mocked<AddressesService>;

    controller = new AddressesController(service);
  });

  it('should call addAddress with correct parameters', async () => {
    const dto: BaseAddressDto = {
      address_name: '집',
      name: '홍길동',
      addr: '서울시',
      addr_detail: '101호',
      zip: '12345',
      tel: '01012345678',
      request: '문앞에 놔주세요',
      is_default: 'Y',
    };
    const result: Address = {
      address_key: 1,
      user: { user_key: 1 },
    } as Address;

    service.addAddress.mockResolvedValue(result);

    const response = await controller.addAddress(1, dto);
    expect(service.addAddress).toHaveBeenCalledWith(1, dto);
    expect(response).toBe(result);
  });

  it('should return all addresses for a user', async () => {
    const mockAddresses = [{ address_key: 1 }] as Address[];
    service.getAllAddress.mockResolvedValue(mockAddresses);

    const response = await controller.getAllAddress(1);
    expect(service.getAllAddress).toHaveBeenCalledWith(1);
    expect(response).toBe(mockAddresses);
  });

  it('should return one address', async () => {
    const mockAddress = { address_key: 1 } as Address;
    service.getOneAddress.mockResolvedValue(mockAddress);

    const response = await controller.getOneAddress(1, 1);
    expect(service.getOneAddress).toHaveBeenCalledWith(1, 1);
    expect(response).toBe(mockAddress);
  });

  it('should update address', async () => {
    const dto: BaseAddressDto = {
      address_name: '회사',
      name: '이몽룡',
      addr: '부산시',
      addr_detail: '202호',
      zip: '54321',
      tel: '01098765432',
      request: '경비실에 맡겨주세요',
      is_default: 'N',
    };
    const updated = { address_key: 1, ...dto } as Address;

    service.updateAddress.mockResolvedValue(updated);

    const response = await controller.updateAddress(1, 1, dto);
    expect(service.updateAddress).toHaveBeenCalledWith(1, 1, dto);
    expect(response).toBe(updated);
  });

  it('should delete address and return message', async () => {
    service.deleteAddress.mockResolvedValue();

    const response = await controller.deleteAddress(1);
    expect(service.deleteAddress).toHaveBeenCalledWith(1);
    expect(response).toEqual({ message: '배송지가 삭제되었습니다.' });
  });
});
