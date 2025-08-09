import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:5174', 'http://127.0.0.1:5174'],
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  await app.listen(8080);
  console.log('🚀 Server is running on http://localhost:8080');
}
bootstrap();
