import { Module } from '@nestjs/common';
import { RoutinesService } from './service/routines.service';
import { RoutineDetailsService } from './service/routine-details.service';
import { RoutineTagRelation } from './entity/routine-tag-relation.entity';
import { Routine } from './entity/routine.entity';
import { Tag } from '../tags/entity/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from '../items/entity/item.entity';
import { TagsService } from '../tags/service/tags.service';
import { TagsModule } from '../tags/tags.module';
import { RoutineTagRelationsService } from './service/routine-tag-relations.service';
import { ItemsService } from '../items/service/items.service';
import { ItemsModule } from '../items/items.module';
import { SkinAttributesService } from '../skin-attributes/service/skin-attributes.service';
import { SkinAttributesModule } from '../skin-attributes/skin-attributes.module';
import { SkinAttribute } from '../skin-attributes/entity/skin-attribute.entity';
import { RoutineDetail } from './entity/routine-detail.entity';
import { User } from '../users/entity/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/service/users.service';
import { RoutineSkinRelation } from './entity/routine-skin-relation.entity';
import { RoutineSkinRelationsService } from './service/routine-skin-relations.service';
import { RoutinesController } from './controller/routines.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Routine,
      RoutineDetail,
      RoutineTagRelation,
      RoutineSkinRelation,
      SkinAttribute,
      Tag,
      Item,
    ]),
    UsersModule,
    TagsModule,
    ItemsModule,
    SkinAttributesModule,
  ],
  providers: [
    UsersService,
    RoutinesService,
    RoutineDetailsService,
    RoutineTagRelationsService,
    RoutineSkinRelationsService,
    JwtService,
  ],
  controllers: [RoutinesController],
  exports: [RoutinesService],
})
export class RoutinesModule { }
