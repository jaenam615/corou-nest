import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SkinAttribute } from './entity/skin-attribute.entity';
import { SkinAttributesService } from './service/skin-attributes.service';

@Module({
  imports: [TypeOrmModule.forFeature([SkinAttribute])],
  providers: [SkinAttributesService],
  exports: [SkinAttributesService],
})
export class SkinAttributesModule {}
