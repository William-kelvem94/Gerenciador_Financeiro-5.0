import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default categories
  const categories = [
    { name: 'Food & Dining', icon: 'utensils', color: '#ef4444', type: 'expense' },
    { name: 'Transportation', icon: 'car', color: '#f97316', type: 'expense' },
    { name: 'Shopping', icon: 'shopping-bag', color: '#eab308', type: 'expense' },
    { name: 'Entertainment', icon: 'film', color: '#8b5cf6', type: 'expense' },
    { name: 'Bills & Utilities', icon: 'file-text', color: '#06b6d4', type: 'expense' },
    { name: 'Healthcare', icon: 'heart', color: '#ec4899', type: 'expense' },
    { name: 'Education', icon: 'book', color: '#10b981', type: 'expense' },
    { name: 'Travel', icon: 'plane', color: '#3b82f6', type: 'expense' },
    { name: 'Salary', icon: 'dollar-sign', color: '#22c55e', type: 'income' },
    { name: 'Freelance', icon: 'briefcase', color: '#059669', type: 'income' },
    { name: 'Investment', icon: 'trending-up', color: '#0d9488', type: 'income' },
    { name: 'Gift', icon: 'gift', color: '#8b5cf6', type: 'income' },
  ];

  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  console.log('✅ Default categories created');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });