import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Item } from '../items/entity/item.entity';
import { ItemsModule } from '../items/items.module';
import { Routine } from '../routines/entity/routine.entity';
import { RoutinesModule } from '../routines/routines.module';
import { Review } from './entity/review.entity';
import { ReviewsService } from './service/reviews.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Routine, Item]),
    RoutinesModule,
    ItemsModule,
  ],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
