import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';
import { BaseAddressDto } from 'src/modules/addresses/dto/baseAddress.dto';
import { AddressesService } from 'src/modules/addresses/service/addresses.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly addressesService: AddressesService,
  ) {}

  @Get('/checkEmail/:email')
  @ApiOperation({ summary: '이메일 중복 확인' })
  async checkEmail(@Body() body: { email: string }) {
    try {
      const email = await this.usersService.findOneByEmail(body.email);
      if (email) {
        return {
          success: false,
          message: '이미 사용중인 이메일입니다.',
          email: email,
        };
      } else {
        return {
          success: true,
          message: '사용 가능한 이메일입니다.',
          email: email,
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : '서버 오류가 발생했습니다.',
      };
    }
  }

  @Get('/checkUsername/:username')
  @ApiOperation({ summary: '닉네임 중복 확인' })
  async checkUsername(@Body() body: { username: string }) {
    try {
      const username = await this.usersService.findOneByUsername(body.username);
      if (username) {
        return {
          success: false,
          message: '이미 사용중인 닉네임입니다.',
          username: username,
        };
      } else {
        return {
          success: true,
          message: '사용 가능한 닉네임입니다.',
          username: username,
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : '서버 오류가 발생했습니다.',
      };
    }
  }

  @Get('/:user_key/address/:addr_key')
  @ApiOperation({ summary: '주소 조회' })
  async getOneAddress(
    @Param('user_key') user_key: number,
    @Param('addr_key') addr_key: number,
  ) {
    try {
      const address = await this.addressesService.getOneAddress(
        user_key,
        addr_key,
      );

      return {
        success: true,
        message: '주소 조회 성공',
        data: address,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        };
      }
    }
  }

  @Get('/:user_key/address')
  @ApiOperation({ summary: '주소록 조회' })
  async getAllAddress(@Param('user_key') user_key: number) {
    try {
      const addresses = await this.addressesService.getAllAddress(user_key);

      return {
        success: true,
        message: '주소록 조회 성공',
        data: addresses,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        };
      }
    }
  }

  @Get('/:user_key')
  @ApiOperation({ summary: '유저 조회' })
  async getUserByKey(@Body() body: { user_key: number }) {
    try {
      const user = await this.usersService.findOneByKey(body.user_key);
      return {
        success: true,
        message: '유저 조회 성공',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : '서버 오류가 발생했습니다.',
      };
    }
  }

  @Get('/')
  @ApiOperation({ summary: '유저 전체 조회' })
  async getAllUsers() {
    try {
      const users = await this.usersService.findAllUsers();
      return {
        success: true,
        message: '유저 전체 조회 성공',
        data: users,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : '서버 오류가 발생했습니다.',
      };
    }
  }

  @Post('/register')
  @ApiOperation({ summary: '회원가입' })
  async createUser(@Body() body: CreateUserDto) {
    try {
      await this.authService.register(body);

      return {
        success: true,
        message: '회원가입 성공',
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        };
      }
    }
  }

  @Post('/login')
  @ApiOperation({ summary: '로그인' })
  async loginUser(@Body() body: LoginDto) {
    try {
      const token = await this.authService.login(body);

      return {
        success: true,
        message: '로그인 성공',
        token,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        };
      }
    }
  }

  @Post('/:user_key/address')
  @ApiOperation({ summary: '주소 등록' })
  async addAddress(
    @Param('user_key') user_key: number,
    @Body() body: BaseAddressDto,
  ) {
    try {
      const address = await this.addressesService.addAddress(user_key, body);

      return {
        success: true,
        message: '주소 등록 성공',
        data: address,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        };
      }
    }
  }

  @Put('/:user_key/address/:addr_key')
  @ApiOperation({ summary: '주소 수정' })
  async updateAddress(
    @Param('user_key') user_key: number,
    @Param('addr_key') addr_key: number,
    @Body() body: BaseAddressDto,
  ) {
    try {
      const address = await this.addressesService.updateAddress(
        user_key,
        addr_key,
        body,
      );

      return {
        success: true,
        message: '주소 수정 성공',
        data: address,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        };
      }
    }
  }

  @Delete('/:user_key/address/:addr_key')
  @ApiOperation({ summary: '주소 삭제' })
  async removeAddress(@Param('addr_key') addr_key: number) {
    try {
      await this.addressesService.deleteAddress(addr_key);

      return {
        success: true,
        message: '주소 삭제 성공',
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        };
      }
    }
  }
}
