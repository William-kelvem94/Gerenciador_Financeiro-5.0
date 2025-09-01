import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/modules/app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  const logger = new Logger('Bootstrap');

  // Enhanced CORS configuration
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_URL?.split(',') || ['https://willfinance.com']
        : [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:3000',
            'http://localhost:8080',
          ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
      'X-API-Key',
    ],
    exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining'],
  });

  // Global validation pipe with enhanced options
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  // Global API prefix
  app.setGlobalPrefix('api');

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = process.env.PORT || 8080;
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);

  logger.log(`🚀 Will Finance 5.0 Server running on ${host}:${port}`);
  logger.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`🔗 API Endpoint: http://${host}:${port}/api`);
  logger.log(`📚 Health Check: http://${host}:${port}/api/health`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('❌ Failed to start server:', error);
  process.exit(1);
});
