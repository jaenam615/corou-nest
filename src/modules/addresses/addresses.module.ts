import { forwardRef, Module } from '@nestjs/common';
import { Address } from './entity/address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesService } from './service/addresses.service';
import { UsersModule } from '../users/users.module';
import { User } from 'src/modules/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address, User]),
    forwardRef(() => UsersModule),
  ],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressesModule {}
