import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AddressesService } from 'src/modules/addresses/service/addresses.service';
import { AuthService } from 'src/modules/users/services/auth.service';
import { UsersService } from 'src/modules/users/services/users.service';

import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly addressesService: AddressesService,
  ) {}

  @Get('/checkEmail/:email')
  @ApiOperation({ summary: '이메일 중복 확인' })
  async checkEmail(@Param('email') email: string) {
    const existingUser = await this.usersService.findOneByEmail(email);
    return {
      success: !existingUser,
      message: existingUser
        ? '이미 사용중인 이메일입니다.'
        : '사용 가능한 이메일입니다.',
      email,
    };
  }

  @Get('/checkUsername/:username')
  @ApiOperation({ summary: '닉네임 중복 확인' })
  async checkUsername(@Param('username') username: string) {
    const existingUser = await this.usersService.findOneByUsername(username);
    return {
      success: !existingUser,
      message: existingUser
        ? '이미 사용중인 닉네임입니다.'
        : '사용 가능한 닉네임입니다.',
      username,
    };
  }

  @Get('/:user_key/address')
  @ApiOperation({ summary: '주소록 조회' })
  async getAllAddress(@Param('user_key') user_key: number) {
    const addresses = await this.addressesService.getAllAddress(user_key);
    return {
      success: true,
      message: '주소록 조회 성공',
      data: addresses,
    };
  }

  @Get('/:user_key')
  @ApiOperation({ summary: '유저 조회' })
  async getUserByKey(@Param('user_key') user_key: number) {
    const user = await this.usersService.findOneByKey(user_key);
    return {
      success: true,
      message: '유저 조회 성공',
      data: user,
    };
  }

  @Get('/')
  @ApiOperation({ summary: '유저 전체 조회' })
  async getAllUsers() {
    const users = await this.usersService.findAllUsers();
    return {
      success: true,
      message: '유저 전체 조회 성공',
      data: users,
    };
  }

  @Post('/register')
  @ApiOperation({ summary: '회원가입' })
  async createUser(@Body() body: CreateUserDto) {
    await this.authService.register(body);
    return {
      success: true,
      message: '회원가입 성공',
    };
  }

  @Post('/login')
  @ApiOperation({ summary: '로그인' })
  async loginUser(@Body() body: LoginDto) {
    const token = await this.authService.login(body);
    return {
      success: true,
      message: '로그인 성공',
      token,
    };
  }
}
