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

@Module({
  imports: [
    TypeOrmModule.forFeature([Routine, Tag, RoutineTagRelation]),
    TagsModule,
    ItemsModule,
  ],
  providers: [
    RoutinesService,
    RoutineDetailsService,
    RoutineTagRelationsService,
    TagsService,
    ItemsService,
  ],
})
export class RoutinesModule {}
