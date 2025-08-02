import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { Gender } from 'src/common/enum/gender.enum';
import { JwtService } from '@nestjs/jwt';
import { DataSource, EntityManager } from 'typeorm';
import { UserSkinRelationsService } from './user-skin-relations.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from 'src/modules/users/entities/user.entity';

import * as bcryptUtils from 'src/common/utils/bcrypt.utils';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  let fakeUserSkinRelationsService: Partial<UserSkinRelationsService>;
  let fakeJwtService: Partial<JwtService>;
  let dataSource: Partial<DataSource>;

  beforeEach(async () => {
    fakeUsersService = {
      findOneByEmail: jest.fn().mockResolvedValue(undefined),
      findOneByUsername: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockResolvedValue({
        user_key: 1,
        email: 'test@example.com',
        password: 'hashed_pw',
        username: 'tester',
        birth_date: new Date('1990-01-01'),
        attributes: [1, 2],
        gender: Gender.M,
      }),
    };

    fakeUserSkinRelationsService = {
      addUserSkinRelation: jest.fn().mockResolvedValue({}),
    };

    dataSource = {
      transaction: jest.fn().mockImplementation(async (runInTransaction) => {
        return await runInTransaction({
          manager: {
            save: jest.fn().mockResolvedValue({}),
          },
        });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: UserSkinRelationsService,
          useValue: fakeUserSkinRelationsService,
        },
        {
          provide: JwtService,
          useValue: fakeJwtService,
        },
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create a user and relate attributes', async () => {
      // 👇 raw password (before hashing)
      const rawPassword = 'plain_pw';
      const hashedPassword = 'hashed_pw';

      const mockCreateUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: rawPassword,
        username: 'tester',
        birth_date: new Date('1990-01-01'),
        gender: Gender.M,
        attributes: [1, 2],
      };

      const savedUser: User = {
        user_key: 1,
        ...mockCreateUserDto,
        password: hashedPassword,
      } as User;

      jest.spyOn(bcryptUtils, 'hashPassword').mockResolvedValue(hashedPassword);

      (dataSource.transaction as jest.Mock).mockImplementation(
        async (_isolationOrCallback, maybeCallback?) => {
          const callback =
            typeof _isolationOrCallback === 'function'
              ? _isolationOrCallback
              : maybeCallback;

          const mockManager: Partial<EntityManager> = {
            save: jest.fn().mockResolvedValue(savedUser),
          };

          return await callback(mockManager as EntityManager);
        },
      );

      const result = await service.register(mockCreateUserDto);

      expect(bcryptUtils.hashPassword).toHaveBeenCalledWith(rawPassword);
      expect(fakeUsersService.create).toHaveBeenCalledWith(
        {
          ...mockCreateUserDto,
          password: hashedPassword,
        },
        expect.any(Object),
      );
      expect(
        fakeUserSkinRelationsService.addUserSkinRelation,
      ).toHaveBeenCalledTimes(2);
      expect(
        fakeUserSkinRelationsService.addUserSkinRelation,
      ).toHaveBeenCalledWith(1, 1, expect.any(Object));
      expect(
        fakeUserSkinRelationsService.addUserSkinRelation,
      ).toHaveBeenCalledWith(1, 2, expect.any(Object));

      expect(result).toEqual(savedUser);
    });
  });
});
