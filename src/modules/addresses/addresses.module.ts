import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';

import { UsersModule } from '../users/users.module';
import { Address } from 'src/modules/addresses/entities/address.entity';
import { AddressesService } from 'src/modules/addresses/services/addresses.service';
import { AddressController } from 'src/modules/addresses/controllers/addresses.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address, User]),
    forwardRef(() => UsersModule),
  ],
  controllers: [AddressController],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressesModule {}
