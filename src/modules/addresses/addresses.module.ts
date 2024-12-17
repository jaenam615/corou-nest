import { forwardRef, Module } from '@nestjs/common';
import { Address } from './entity/address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesService } from './service/addresses.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), forwardRef(() => UsersModule)],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressesModule { }
