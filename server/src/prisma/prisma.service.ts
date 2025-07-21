import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private static instance: PrismaService;

  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
    }
    return PrismaService.instance;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('📊 Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('📊 Database disconnected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to disconnect from database:', error);
    }
  }

  async enableShutdownHooks(app: { close: () => Promise<void> }) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  // Transaction helper method for better error handling
  async executeTransaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
    try {
      return await this.$transaction(fn);
    } catch (error) {
      this.logger.error('❌ Transaction failed:', error);
      throw error;
    }
  }
}