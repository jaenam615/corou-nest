import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { hashPassword, comparePassword } from 'src/common/utils/bcrypt.utils';
import { LoginDto } from '../dto/login.dto';
import { DataSource } from 'typeorm';
import { UserSkinRelationsService } from './user-skin-relations.service';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private userSkinRelationsService: UserSkinRelationsService,
    private dataSource: DataSource,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hashPassword(createUserDto.password);

    return this.dataSource.transaction(async (manager) => {
      await this.duplicateCheck(createUserDto.email, createUserDto.username);
      const userInput: CreateUserDto = {
        ...createUserDto,
        password: hashedPassword,
      };

      const newUser = await this.usersService.create(userInput, manager);

      await Promise.all(
        createUserDto.attributes.map((attr_key) =>
          this.userSkinRelationsService.addUserSkinRelation(
            newUser.user_key,
            attr_key,
            manager,
          ),
        ),
      );

      return newUser;
    });
  }

  async login(body: LoginDto): Promise<{ token: string }> {
    const { email, password } = body;

    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('존재하지 않는 이메일입니다.');
    }

    const isPasswordMatched = await comparePassword(password, user.password);
    if (!isPasswordMatched) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const token = this.jwtService.sign({ user_key: user.user_key });
    return { token };
  }

  private async duplicateCheck(email: string, username: string) {
    if (await this.usersService.findOneByEmail(email)) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
    if (await this.usersService.findOneByUsername(username)) {
      throw new ConflictException('이미 존재하는 닉네임입니다.');
    }
  }
}
