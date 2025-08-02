import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { UserSkinRelationsService } from './user-skin-relations.service';
import { CreateUserDto } from '../dto/create-user.dto';

import * as bcryptUtils from '../../../common/utils/bcrypt.utils';

const mockUser = {
  user_key: 1,
  username: 'tester',
  email: 'test@example.com',
  birth_date: new Date('1990-01-01'),
} as User;

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<Repository<User>>;
  let dataSource: jest.Mocked<DataSource>;
  let userSkinRelationService: jest.Mocked<UserSkinRelationsService>;

  beforeEach(async () => {
    usersRepository = {
      findOneBy: jest.fn(),
      find: jest.fn(),
    } as any;

    dataSource = {
      transaction: jest.fn(),
    } as any;

    userSkinRelationService = {
      addUserSkinRelation: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: usersRepository },
        { provide: DataSource, useValue: dataSource },
        {
          provide: UserSkinRelationsService,
          useValue: userSkinRelationService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user and relate attributes', async () => {
      jest.spyOn(bcryptUtils, 'hashPassword').mockResolvedValue('hashed_pw');

      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: 'plain_pw',
        username: 'tester',
        birth_date: new Date('1990-01-01'),
        gender: 'M' as any,
        attributes: [1, 2],
      };

      const savedUser = { user_key: 42, ...dto, password: 'hashed_pw' } as User;

      dataSource.transaction.mockImplementation(
        async (_isolationOrCallback, maybeCallback?) => {
          const callback =
            typeof _isolationOrCallback === 'function'
              ? _isolationOrCallback
              : maybeCallback;
          const mockManager = {
            save: jest.fn().mockResolvedValue(savedUser),
          } as unknown as EntityManager;
          return await callback(mockManager);
        },
      );

      const result = await service.create(dto);

      expect(bcryptUtils.hashPassword).toHaveBeenCalledWith('plain_pw');

      expect(userSkinRelationService.addUserSkinRelation).toHaveBeenCalledTimes(
        2,
      );
      expect(userSkinRelationService.addUserSkinRelation).toHaveBeenCalledWith(
        42,
        1,
        expect.any(Object),
      );
      expect(userSkinRelationService.addUserSkinRelation).toHaveBeenCalledWith(
        42,
        2,
        expect.any(Object),
      );

      expect(result).toEqual(savedUser);
    });
  });

  describe('findOneByKey', () => {
    it('should find a user by key', async () => {
      const userKey = 1;

      usersRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findOneByKey(userKey);
      expect(result).toEqual(mockUser);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({
        user_key: userKey,
      });
    });
  });

  describe('findOneByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';

      usersRepository.findOneBy.mockResolvedValue(mockUser);
      const result = await service.findOneByEmail(email);
      expect(result).toEqual(mockUser);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ email });
    });
  });

  describe('findOneByUsername', () => {
    it('should find a user by username', async () => {
      const username = 'tester';

      usersRepository.findOneBy.mockResolvedValue(mockUser);
      const result = await service.findOneByUsername(username);
      expect(result).toEqual(mockUser);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ username });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      usersRepository.find.mockResolvedValue(users);

      const result = await service.findAllUsers();
      expect(result).toEqual(users);
      expect(usersRepository.find).toHaveBeenCalled();
    });
  });
});
