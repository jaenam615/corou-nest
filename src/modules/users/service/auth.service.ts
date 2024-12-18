import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import {
  hashPassword,
  comparePassword,
} from '../../../common/utils/bcrypt.utils';
import { LoginDto } from '../dto/login.dto';
import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import { UserSkinRelationsService } from './user-skin-relations.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private userSkinRelationsService: UserSkinRelationsService,
    private dataSource: DataSource,
  ) {}

  async register(body: CreateUserDto): Promise<void> {
    const { email, password, username, birth_date, gender, attributes } = body;
    const hashedPassword = await hashPassword(password);

    return this.dataSource.transaction(async (transactionalEntityManager) => {
      {
        isolation: 'READ COMMITTED';
      }

      const emailCheck = await this.usersService.findOneByEmail(email);
      if (emailCheck) {
        throw new ConflictException('이미 존재하는 이메일입니다.');
      }

      const usernameCheck = await this.usersService.findOneByUsername(username);
      if (usernameCheck) {
        throw new ConflictException('이미 존재하는 닉네임입니다.');
      }

      const newUser = await this.usersService.create(
        email,
        hashedPassword,
        username,
        birth_date,
        gender,
        transactionalEntityManager,
      );

      for (const attribute of attributes) {
        await this.userSkinRelationsService.addUserSkinRelation(
          newUser.user_key,
          attribute,
          transactionalEntityManager,
        );
      }

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

  async verifyToken(token: string): Promise<User> {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
