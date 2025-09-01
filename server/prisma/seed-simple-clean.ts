import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';

const prisma = new PrismaClient();
const logger = new Logger('DatabaseSeed');

async function main() {
  logger.log('Starting seed process...');

  // Categories seeding
  const categories = [
    { name: 'Alimentação', icon: '🍔', color: '#FF6B6B', type: 'EXPENSE' },
    { name: 'Transporte', icon: '🚗', color: '#4ECDC4', type: 'EXPENSE' },
    { name: 'Moradia', icon: '🏠', color: '#45B7D1', type: 'EXPENSE' },
    { name: 'Saúde', icon: '🏥', color: '#96CEB4', type: 'EXPENSE' },
    { name: 'Educação', icon: '📚', color: '#FFEAA7', type: 'EXPENSE' },
    { name: 'Lazer', icon: '🎮', color: '#DDA0DD', type: 'EXPENSE' },
    { name: 'Roupas', icon: '👕', color: '#98D8C8', type: 'EXPENSE' },
    { name: 'Salário', icon: '💰', color: '#27AE60', type: 'INCOME' },
    { name: 'Freelance', icon: '💻', color: '#2ECC71', type: 'INCOME' },
    { name: 'Investimentos', icon: '�', color: '#F7DC6F', type: 'INCOME' },
    { name: 'Outros', icon: '📦', color: '#BB8FCE', type: 'BOTH' }
  ];

  for (const category of categories) {
    try {
      await prisma.category.create({
        data: {
          ...category,
          description: `Categoria ${category.name}`,
          isSystem: true,
        },
      });
    } catch (error) {
      logger.error(`Error creating category ${category.name}:`, error);
    }
  }

  logger.log('Categories created');
  logger.log('Skipping demo user, accounts, and transactions for development');
  logger.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    logger.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
