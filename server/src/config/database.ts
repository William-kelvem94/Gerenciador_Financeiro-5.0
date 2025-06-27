import { PrismaClient } from '@prisma/client';
import { logger } from '@/utils/logger';

let prisma: PrismaClient;

export const connectDatabase = async () => {
  try {
    prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });

    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    logger.info('Database connection established');
    
    return prisma;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    logger.error('Database connection failed', error);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  if (prisma) {
    await prisma.$disconnect();
    console.log('📴 Database disconnected');
    logger.info('Database disconnected');
  }
};

export { prisma };
