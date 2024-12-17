import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as http from 'http';
import https from 'https';
import 'tsconfig-paths/register';

async function bootstrap() {
  Object.assign(BigInt.prototype, {
    toJSON: function () {
      return this.toString();
    },
  });

  // express 서버
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // ValidationPipe 설정
  app.useGlobalPipes(new ValidationPipe());

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Corou API')
    .setDescription('Corou API')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      name: 'JWT',
      in: 'header',
    })
    .build();

  // Swagger 설정 적용
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.init();

  http.createServer(server).listen(process.env.PORT ?? 3000, () => {
    console.log(
      `Server is running on http://localhost:${process.env.PORT ?? 3000}`,
    );
  });
}
bootstrap();
