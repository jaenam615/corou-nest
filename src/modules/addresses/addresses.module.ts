import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';

import { UsersModule } from '../users/users.module';
import { Address } from './entity/address.entity';
import { AddressesService } from './service/addresses.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address, User]),
    forwardRef(() => UsersModule),
  ],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressesModule {}
