import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from 'src/modules/users/services/users.service';
import { AuthService } from 'src/modules/users/services/auth.service';
import { AddressesService } from 'src/modules/addresses/service/addresses.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<UsersService>;
  let authService: Partial<AuthService>;
  let addressesService: Partial<AddressesService>;

  beforeEach(async () => {
    usersService = {
      findOneByEmail: jest.fn(),
      findOneByUsername: jest.fn(),
      findOneByKey: jest.fn(),
      findAllUsers: jest.fn(),
    };
    authService = {
      register: jest.fn(),
      login: jest.fn(),
    };
    addressesService = {
      getAllAddress: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: AuthService, useValue: authService },
        { provide: AddressesService, useValue: addressesService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('checkEmail', () => {
    it('returns success false when email exists', async () => {
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue({ id: 1 });
      const res = await controller.checkEmail('exists@example.com');
      expect(res).toEqual({
        success: false,
        message: '이미 사용중인 이메일입니다.',
        email: 'exists@example.com',
      });
    });

    it('returns success true when email does not exist', async () => {
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(undefined);
      const res = await controller.checkEmail('new@example.com');
      expect(res).toEqual({
        success: true,
        message: '사용 가능한 이메일입니다.',
        email: 'new@example.com',
      });
    });
  });

  describe('checkUsername', () => {
    it('returns success false when username exists', async () => {
      (usersService.findOneByUsername as jest.Mock).mockResolvedValue({
        id: 1,
      });
      const res = await controller.checkUsername('existingUser');
      expect(res).toEqual({
        success: false,
        message: '이미 사용중인 닉네임입니다.',
        username: 'existingUser',
      });
    });

    it('returns success true when username does not exist', async () => {
      (usersService.findOneByUsername as jest.Mock).mockResolvedValue(
        undefined,
      );
      const res = await controller.checkUsername('newUser');
      expect(res).toEqual({
        success: true,
        message: '사용 가능한 닉네임입니다.',
        username: 'newUser',
      });
    });
  });

  describe('getAllAddress', () => {
    it('returns addresses for user', async () => {
      const mockAddresses = [{ id: 1 }, { id: 2 }];
      (addressesService.getAllAddress as jest.Mock).mockResolvedValue(
        mockAddresses,
      );

      const res = await controller.getAllAddress(123);
      expect(res).toEqual({
        success: true,
        message: '주소록 조회 성공',
        data: mockAddresses,
      });
      expect(addressesService.getAllAddress).toHaveBeenCalledWith(123);
    });
  });

  describe('getUserByKey', () => {
    it('returns user data', async () => {
      const mockUser = { user_key: 123, email: 'user@example.com' };
      (usersService.findOneByKey as jest.Mock).mockResolvedValue(mockUser);

      const res = await controller.getUserByKey(123);
      expect(res).toEqual({
        success: true,
        message: '유저 조회 성공',
        data: mockUser,
      });
      expect(usersService.findOneByKey).toHaveBeenCalledWith(123);
    });
  });

  describe('getAllUsers', () => {
    it('returns list of users', async () => {
      const mockUsers = [{ user_key: 1 }, { user_key: 2 }];
      (usersService.findAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      const res = await controller.getAllUsers();
      expect(res).toEqual({
        success: true,
        message: '유저 전체 조회 성공',
        data: mockUsers,
      });
      expect(usersService.findAllUsers).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('calls authService.register and returns success message', async () => {
      (authService.register as jest.Mock).mockResolvedValue(undefined);
      const dto = new CreateUserDto({
        email: 'test@example.com',
        password: 'pwd',
        username: 'tester',
      });
      const res = await controller.createUser(dto);
      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(res).toEqual({
        success: true,
        message: '회원가입 성공',
      });
    });
  });

  describe('loginUser', () => {
    it('calls authService.login and returns token', async () => {
      (authService.login as jest.Mock).mockResolvedValue({
        token: 'fake-token',
      });
      const dto = { email: 'test@example.com', password: 'pwd' };
      const res = await controller.loginUser(dto);
      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(res).toEqual({
        success: true,
        message: '로그인 성공',
        token: { token: 'fake-token' },
      });
    });
  });
});
