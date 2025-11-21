import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Client } from 'pg';

async function bootstrap() {
  // Create schema if it doesn't exist (Production/Docker setup)
  if (process.env.DATABASE_URL) {
    try {
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
      });
      await client.connect();
      await client.query('CREATE SCHEMA IF NOT EXISTS softbook_ai');
      await client.end();
      console.log('Schema softbook_ai checked/created successfully');
    } catch (error) {
      console.error('Error creating schema:', error);
      // Don't block startup, let TypeORM try or fail
    }
  }

  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend connection
  app.enableCors({
    origin: process.env.FRONTEND_SOFTBOOK_AI_URL || 'http://localhost:3002',
    credentials: true,
  });

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Add API prefix
  app.setGlobalPrefix('api');

  await app.listen(process.env.SOFTBOOK_AI_BACKEND_PORT ?? 5000);
  console.log(`Application is running on: http://localhost:${process.env.SOFTBOOK_AI_BACKEND_PORT ?? 3000}`);
}
bootstrap();

