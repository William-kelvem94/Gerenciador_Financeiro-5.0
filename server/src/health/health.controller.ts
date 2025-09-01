import { Controller, Get, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    try {
      // Database health check
      const dbHealth = await this.prisma.healthCheck();

      // Basic system info
      const systemInfo = {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '6.0.0',
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: {
          used:
            Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
            100,
          total:
            Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
            100,
          external:
            Math.round((process.memoryUsage().external / 1024 / 1024) * 100) /
            100,
        },
      };

      this.logger.log('Health check successful');

      return {
        status: 'ok',
        message: '🚀 Will Finance 5.0 API is healthy',
        timestamp: systemInfo.timestamp,
        uptime: `${Math.floor(systemInfo.uptime / 60)}m ${Math.floor(systemInfo.uptime % 60)}s`,
        environment: systemInfo.environment,
        version: systemInfo.version,
        services: {
          database: dbHealth.status,
          api: 'healthy',
        },
        system: systemInfo,
      };
    } catch (error) {
      this.logger.error('Health check failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      return {
        status: 'error',
        message: '❌ Health check failed',
        error:
          process.env.NODE_ENV === 'development'
            ? errorMessage
            : 'Internal server error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('db')
  async checkDatabase() {
    try {
      const result = await this.prisma.healthCheck();
      const stats = await this.prisma.getDatabaseStats();

      return {
        ...result,
        message: '🗄️ Database is healthy',
        statistics: stats,
      };
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      return {
        status: 'error',
        message: '❌ Database health check failed',
        error:
          process.env.NODE_ENV === 'development'
            ? errorMessage
            : 'Database connection error',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
