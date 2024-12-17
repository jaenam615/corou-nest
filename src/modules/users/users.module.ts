import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './service/users.service';
import { UsersController } from './controller/users.controller';
import { User } from './entity/user.entity';
import { Address } from '../addresses/entity/address.entity';
import { AuthService } from './service/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AddressesModule } from '../addresses/addresses.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address]), AddressesModule],
  providers: [UsersService, AuthService, JwtService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule { }
