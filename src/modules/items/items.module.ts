import { Module } from '@nestjs/common';
import { ItemsService } from './service/items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entity/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
