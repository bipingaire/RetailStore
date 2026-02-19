
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  // app module initialized
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (requestOrigin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3010',
        'https://retailos.cloud',
        'https://www.retailos.cloud',
        'https://indumart.us',
        'https://www.indumart.us',
      ];
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!requestOrigin) return callback(null, true);

      if (allowedOrigins.includes(requestOrigin)) {
        return callback(null, true);
      }

      // Dynamic subdomains for InduMart (e.g. https://greensboro.indumart.us)
      if (/^https:\/\/[a-z0-9-]+\.indumart\.us$/.test(requestOrigin)) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  // Set very large payload size limit for file uploads (1GB)
  app.use(express.json({ limit: '10gb' }));
  app.use(express.urlencoded({ limit: '10gb', extended: true }));

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

