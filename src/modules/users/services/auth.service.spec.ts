import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { Gender } from '../../../common/enum/gender.enum';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { UserSkinRelationsService } from './user-skin-relations.service';
import { CreateUserDto } from '../dto/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  let fakeUserSkinRelationsService: Partial<UserSkinRelationsService>;
  let fakeJwtService: Partial<JwtService>;
  let fakeDataSource: Partial<DataSource>;

  beforeEach(async () => {
    fakeUsersService = {
      findOneByEmail: jest.fn().mockResolvedValue(undefined),
      findOneByUsername: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockResolvedValue({
        user_key: 1,
        email: 'test@example.com',
        password: 'password',
        username: 'username',
        birth_date: new Date(),
        gender: Gender.M,
      }),
    };

    fakeUserSkinRelationsService = {
      addUserSkinRelation: jest.fn().mockResolvedValue({}),
    };

    fakeJwtService = {
      sign: jest.fn(() => 'fake-jwt-token'),
      verify: jest.fn().mockImplementation(
        (token: string) =>
          ({
            user_key: 1,
            email: 'jae@corou.shop',
            username: 'username',
            birth_date: new Date(),
            gender: Gender.M,
          }) as any,
      ),
    };

    fakeDataSource = {
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
          useValue: fakeDataSource,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'jest@corou.shop',
      password: 'password123',
      username: 'new',
      birth_date: new Date(),
      gender: Gender.M,
      attributes: [1, 7, 10, 11],
    };

    const result = await service.register(createUserDto);

    expect(result).toBeDefined();
  });
});
