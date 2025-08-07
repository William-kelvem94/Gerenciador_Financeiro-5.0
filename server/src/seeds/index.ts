import { PrismaClient } from '@prisma/client';
import { seedCategories } from './categories';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🚀 Starting database seeding...\n');

    // Seed categories
    await seedCategories();

    console.log('\n✅ All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
