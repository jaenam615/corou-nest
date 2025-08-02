import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/modules/users/services/users.service';
import { UsersController } from 'src/modules/users/controllers/users.controller';
import { User } from 'src/modules/users/entities/user.entity';
import { Address } from '../addresses/entity/address.entity';
import { AuthService } from 'src/modules/users/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AddressesModule } from '../addresses/addresses.module';
import { UserSkinRelationsService } from 'src/modules/users/services/user-skin-relations.service';
import { UserSkinRelation } from 'src/modules/users/entities/user-skin-relation.entity';

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
