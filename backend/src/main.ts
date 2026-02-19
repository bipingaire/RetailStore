
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  // app module initialized
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3010',
      process.env.FRONTEND_URL || 'http://localhost:3010',
    ],
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

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port} (Backend Restarted)`);
}

bootstrap();

