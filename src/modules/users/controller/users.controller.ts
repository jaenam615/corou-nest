import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { AuthService } from '../service/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Post('/register')
  @ApiOperation({ summary: '회원가입' })
  async createUser(@Body body: CreateUserDto) {
    try {
      await this.authService.register(body);

      return {
        success: true,
        message: '회원가입 성공',
      };
    } catch (error) {
      if (error instanceof  )
    }
  }
}
