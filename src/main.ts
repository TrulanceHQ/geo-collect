/* eslint-disable @typescript-eslint/no-floating-promises */
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MongoExceptionFilter } from './../mongo-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new MongoExceptionFilter());
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 3001;

  const config = new DocumentBuilder()
    .setTitle('Data Collection App (Web)')
    .setDescription(
      'Web app for data collection with media capture and geolocation tagging.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    // .addTag('users')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port);

  console.log(`Application is running on port: ${port}`);
}

bootstrap();
