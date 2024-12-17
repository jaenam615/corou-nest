import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './service/users.service';
import { UsersController } from './controller/users.controller';
import { User } from './entity/user.entity';
import { Address } from '../addresses/entity/address.entity';
import { AuthService } from './service/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AddressModule } from 'src/address/address.module';
import { AddressesService } from '../addresses/service/addresses.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address]), AddressModule],
  providers: [UsersService, AuthService, JwtService, AddressesService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
