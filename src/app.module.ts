import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { RoutinesModule } from './modules/routines/routines.module';
import { User } from './modules/users/entity/user.entity';
import { UserSkinRelationsModule } from './user-skin-relations/user-skin-relations.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
