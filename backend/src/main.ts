
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Set very large payload size limit for file uploads (1GB)
  app.use(express.json({ limit: '1000mb' }));
  app.use(express.urlencoded({ limit: '1000mb', extended: true }));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.setGlobalPrefix('api');

  await app.listen(3001);
  console.log('🚀 Server running on http://localhost:3001 (Backend Restarted)');
}

bootstrap();

