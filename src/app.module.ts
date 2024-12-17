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
import { ItemOrdersModule } from './modules/item-orders/item-orders.module';
import { TagsModule } from './modules/tags/tags.module';
import { Address } from './modules/addresses/entity/address.entity';
import { Routine } from './modules/routines/entity/routine.entity';
import { Cart } from './modules/carts/entity/cart.entity';
import { Review } from './modules/reviews/entity/review.entity';
import { SkinAttribute } from './modules/skin-attributes/entity/skin-attribute.entity';
import { Item } from './modules/items/entity/item.entity';
import { OrderDetail } from './modules/order-details/entity/order-detail.entity';
import { RoutineTagRelation } from './modules/routines/entity/routine-tag-relation.entity';
import { RoutineSkinRelation } from './modules/routines/entity/routine-skin-relation.entity';
import { ItemOrder } from './modules/item-orders/entity/item-order.entity';
import { Tag } from './modules/tags/entity/tag.entity';
import { RoutineDetail } from './modules/routines/entity/routine-detail.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          User,
          Routine,
          Address,
          Cart,
          Review,
          SkinAttribute,
          Item,
          OrderDetail,
          RoutineDetail,
          RoutineTagRelation,
          RoutineSkinRelation,
          ItemOrder,
          Tag,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
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
    ItemOrdersModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
