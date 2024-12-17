import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { RoutinesModule } from './modules/routines/routines.module';
import { User } from './modules/users/entity/user.entity';
import { UserSkinRelationsModule } from './modules/user-skin-relations/user-skin-relations.module';
import { CartsModule } from './modules/carts/carts.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { SkinAttributesModule } from './modules/skin-attributes/skin-attributes.module';
import { ItemsModule } from './modules/items/items.module';
import { OrderDetailsModule } from './modules/order-details/order-details.module';
import { RoutineTagRelationsModule } from './modules/routine-tag-relations/routine-tag-relations.module';
import { RoutineSkinRelationsModule } from './modules/routine-skin-relations/routine-skin-relations.module';
import { ItemOrdersModule } from './modules/item-orders/item-orders.module';
import { TagsModule } from './modules/tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User],
    }),
    UsersModule,
    RoutinesModule,
    UserSkinRelationsModule,
    CartsModule,
    AddressesModule,
    ReviewsModule,
    SkinAttributesModule,
    ItemsModule,
    OrderDetailsModule,
    RoutineTagRelationsModule,
    RoutineSkinRelationsModule,
    ItemOrdersModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
