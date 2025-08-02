import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./test.db',
    },
  },
});

beforeAll(async () => {
  // Set up test database
  await prisma.$connect();
});

afterAll(async () => {
  // Clean up test database
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean database before each test
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.account.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
});

export { prisma };
