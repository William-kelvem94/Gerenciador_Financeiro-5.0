import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração de CORS para desenvolvimento local
  app.enableCors({
    origin: ['http://localhost:4000', 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  });

  // Usar porta 3001 para evitar conflito
  const port = process.env.BACKEND_PORT ?? 3001;
  await app.listen(port);
  
  console.log(`🚀 Backend rodando em: http://localhost:${port}`);
  console.log(`📊 Dashboard: http://localhost:${port}/dashboard`);
  console.log(`💰 Transações: http://localhost:${port}/transactions`);
}

bootstrap();
