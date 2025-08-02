import { Module } from '@nestjs/common';
import { ReviewsService } from './service/reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entity/review.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Routine } from '../routines/entity/routine.entity';
import { Item } from '../items/entity/item.entity';
import { UsersModule } from '../users/users.module';
import { RoutinesModule } from '../routines/routines.module';
import { ItemsModule } from '../items/items.module';
import { UsersService } from 'src/modules/users/services/users.service';
import { RoutinesService } from '../routines/service/routines.service';
import { ItemsService } from '../items/service/items.service';

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
