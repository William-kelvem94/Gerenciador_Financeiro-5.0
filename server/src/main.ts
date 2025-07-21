
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // Enable CORS
  app.enableCors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:8080',
      'http://localhost:8080',
      'http://127.0.0.1:8080'
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Will Finance 6.0 API')
    .setDescription('Complete financial management system API')
    .setVersion('6.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Global prefix para API
  app.setGlobalPrefix('api');

  // Servir arquivos estáticos do frontend React/Vite
  const clientDistPath = join(__dirname, '../../client/dist');
  app.useStaticAssets(clientDistPath, { index: false });
  app.getHttpAdapter().get('*', (req: ExpressRequest, res: ExpressResponse, next) => {
    if (req.url.startsWith('/api') || req.url.startsWith('/api/docs')) {
      return next?.();
    }
    res.sendFile(join(clientDistPath, 'index.html'));
  });

  const port = process.env.PORT || 8080;
  await app.listen(port);
  
  console.log(`🚀 Will Finance 6.0 API + Frontend is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();