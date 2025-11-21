import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
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

