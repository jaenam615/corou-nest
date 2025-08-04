import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TagsController } from './controller/tags.controller';
import { Tag } from './entity/tag.entity';
import { TagsService } from './service/tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagsService],
  controllers: [TagsController],
  exports: [TagsService],
})
export class TagsModule {}
