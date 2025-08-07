import { prisma } from '../db/client';

describe('PrismaClient Singleton', () => {
  it('should create a single instance of PrismaClient', () => {
    // Import prisma multiple times
    const { prisma: prisma1 } = require('../db/client');
    const { prisma: prisma2 } = require('../db/client');

    // Both imports should return the same instance
    expect(prisma1).toBe(prisma2);
    expect(prisma).toBe(prisma1);
  });

  it('should have proper configuration', () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma.$connect).toBe('function');
    expect(typeof prisma.$disconnect).toBe('function');
    expect(typeof prisma.$transaction).toBe('function');
  });

  it('should be able to connect to database', async () => {
    // This should not throw an error
    await expect(prisma.$queryRaw`SELECT 1`).resolves.toBeDefined();
  });
});
