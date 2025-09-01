import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'stdout', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('🔌 Database disconnected');
    } catch (error) {
      this.logger.error('Failed to disconnect from database:', error);
    }
  }

  /**
   * Enhanced transaction wrapper with logging
   */
  async executeTransaction<T>(
    fn: (
      prisma: Omit<
        PrismaClient,
        '$on' | '$connect' | '$disconnect' | '$transaction' | '$extends'
      >,
    ) => Promise<T>,
    description?: string,
  ): Promise<T> {
    const startTime = Date.now();
    this.logger.debug(
      `Starting transaction: ${description || 'Unknown operation'}`,
    );

    try {
      const result = await this.$transaction(fn);
      const duration = Date.now() - startTime;
      this.logger.debug(
        `Transaction completed in ${duration}ms: ${description || 'Unknown operation'}`,
      );
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Transaction failed after ${duration}ms: ${description || 'Unknown operation'}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Health check method
   */
  async healthCheck(): Promise<{ status: string; timestamp: Date }> {
    try {
      await this.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      throw new Error('Database unhealthy');
    }
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats() {
    try {
      const [users, transactions, accounts, categories] = await Promise.all([
        this.user.count(),
        this.transaction.count(),
        this.account.count(),
        this.category.count(),
      ]);

      return {
        users,
        transactions,
        accounts,
        categories,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Failed to get database stats:', error);
      throw error;
    }
  }
}
