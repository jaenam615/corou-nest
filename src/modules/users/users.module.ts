import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from 'src/modules/users/controllers/users.controller';
import { UserSkinRelation } from 'src/modules/users/entities/user-skin-relation.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { AuthService } from 'src/modules/users/services/auth.service';
import { UserSkinRelationsService } from 'src/modules/users/services/user-skin-relations.service';
import { UsersService } from 'src/modules/users/services/users.service';

import { AddressesModule } from '../addresses/addresses.module';
import { Address } from '../addresses/entity/address.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address, UserSkinRelation]),
    AddressesModule,
  ],
  providers: [UsersService, AuthService, JwtService, UserSkinRelationsService],
  controllers: [UsersController],
  exports: [UsersService, JwtService],
})
export class UsersModule {}
