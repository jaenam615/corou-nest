import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UserSkinRelationsService } from './user-skin-relations.service';
import { UsersService } from './users.service';

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

  describe('UsersService.create', () => {
    it('should save a user via the passed EntityManager', async () => {
      const userInput: CreateUserDto = {
        email: 'test@example.com',
        password: 'hashed_pw',
        username: 'tester',
        birth_date: new Date('1990-01-01'),
        gender: 'M' as any,
        attributes: [1, 2],
      };

      const savedUser = { user_key: 42, ...userInput } as User;

      const mockManager = {
        save: jest.fn().mockResolvedValue(savedUser),
      } as unknown as EntityManager;

      const result = await service.create(userInput, mockManager);

      expect(mockManager.save).toHaveBeenCalledWith(User, userInput);
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
