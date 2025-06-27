import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';
import { DashboardController } from './dashboard.controller';
import { Transaction } from './transaction/transaction.entity';
import { User } from './auth/auth.entity';
import { IaChatController } from './ia-chat.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // Configuração dinâmica: PostgreSQL para produção, SQLite para desenvolvimento
      type: process.env.NODE_ENV === 'production' ? 'postgres' : 'sqlite',
      
      // Configuração PostgreSQL (produção/docker)
      ...(process.env.NODE_ENV === 'production' && {
        host: process.env.DATABASE_HOST ?? 'localhost',
        port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
        username: process.env.DATABASE_USER ?? 'financeiro',
        password: process.env.DATABASE_PASSWORD ?? 'financeiro',
        database: process.env.DATABASE_NAME ?? 'financeiro',
      }),
      
      // Configuração SQLite (desenvolvimento local)
      ...(process.env.NODE_ENV !== 'production' && {
        database: './data/financeiro.db',
      }),
      
      entities: [Transaction, User], // Especificando entidades diretamente
      synchronize: true, // ⚠️ Apenas para desenvolvimento
      logging: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([Transaction, User]),
    TransactionModule,
    AuthModule,
  ],
  controllers: [DashboardController, IaChatController],
})
export class AppModule {}
