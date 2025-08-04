import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/services/users.service';

import { Item } from '../items/entity/item.entity';
import { ItemsModule } from '../items/items.module';
import { SkinAttribute } from '../skin-attributes/entity/skin-attribute.entity';
import { SkinAttributesModule } from '../skin-attributes/skin-attributes.module';
import { Tag } from '../tags/entity/tag.entity';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';
import { RoutinesController } from './controller/routines.controller';
import { RoutineDetail } from './entity/routine-detail.entity';
import { RoutineSkinRelation } from './entity/routine-skin-relation.entity';
import { RoutineTagRelation } from './entity/routine-tag-relation.entity';
import { Routine } from './entity/routine.entity';
import { RoutineDetailsService } from './service/routine-details.service';
import { RoutineSkinRelationsService } from './service/routine-skin-relations.service';
import { RoutineTagRelationsService } from './service/routine-tag-relations.service';
import { RoutinesService } from './service/routines.service';

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
  ],
  controllers: [RoutinesController],
  exports: [RoutinesService],
})
export class RoutinesModule {}
