import { Module } from '@nestjs/common';
import { SkinAttributesService } from './service/skin-attributes.service';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkinAttribute } from './entity/skin-attribute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SkinAttribute])],
  providers: [SkinAttributesService],
  exports: [SkinAttributesService],
})
export class SkinAttributesModule {}
