import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default user
  let defaultUser;
  try {
    defaultUser = await prisma.user.upsert({
      where: { email: 'admin@willfinance.com' },
      update: {},
      create: {
        email: 'admin@willfinance.com',
        name: 'Admin User',
        password: '$2b$10$dummyhashedpassword', // This would be properly hashed in real scenario
        role: 'ADMIN',
        isActive: true,
        emailVerified: true,
      },
    });
    console.log('✅ Default user created/updated');
  } catch (error) {
    console.error('❌ Error creating user:', error);
    return;
  }

  // Create default account
  let defaultAccount;
  try {
    defaultAccount = await prisma.account.upsert({
      where: { id: 'default-account-id' },
      update: {},
      create: {
        id: 'default-account-id',
        name: 'Conta Principal',
        type: 'CHECKING',
        balance: 0,
        currency: 'BRL',
        isActive: true,
        userId: defaultUser.id,
        color: '#3B82F6',
        icon: 'wallet',
        description: 'Conta padrão do sistema',
      },
    });
    console.log('✅ Default account created/updated');
  } catch (error) {
    console.error('❌ Error creating account:', error);
    return;
  }

  // Create default categories
  const categories = [
    { name: 'Alimentação', icon: 'utensils', color: '#ef4444', type: 'EXPENSE' },
    { name: 'Transporte', icon: 'car', color: '#f97316', type: 'EXPENSE' },
    { name: 'Moradia', icon: 'home', color: '#8b5cf6', type: 'EXPENSE' },
    { name: 'Saúde', icon: 'heart', color: '#ec4899', type: 'EXPENSE' },
    { name: 'Educação', icon: 'book', color: '#10b981', type: 'EXPENSE' },
    { name: 'Lazer', icon: 'film', color: '#8b5cf6', type: 'EXPENSE' },
    { name: 'Compras', icon: 'shopping-bag', color: '#eab308', type: 'EXPENSE' },
    { name: 'Conta/Utilidades', icon: 'file-text', color: '#06b6d4', type: 'EXPENSE' },
    { name: 'Investimentos', icon: 'trending-up', color: '#0d9488', type: 'EXPENSE' },
    { name: 'Outros', icon: 'more-horizontal', color: '#6b7280', type: 'EXPENSE' },
    { name: 'Salário', icon: 'dollar-sign', color: '#22c55e', type: 'INCOME' },
    { name: 'Freelance', icon: 'briefcase', color: '#059669', type: 'INCOME' },
    { name: 'Investimentos', icon: 'trending-up', color: '#0d9488', type: 'INCOME' },
    { name: 'Vendas', icon: 'shopping-cart', color: '#16a34a', type: 'INCOME' },
    { name: 'Aluguéis', icon: 'home', color: '#0ea5e9', type: 'INCOME' },
    { name: 'Prêmios', icon: 'gift', color: '#8b5cf6', type: 'INCOME' },
    { name: 'Outros', icon: 'more-horizontal', color: '#6b7280', type: 'INCOME' },
  ];

  // Create categories
  const createdCategories: any[] = [];
  for (const category of categories) {
    try {
      const createdCategory = await prisma.category.upsert({
        where: { 
          name_userId: { 
            name: category.name, 
            userId: defaultUser.id 
          } 
        },
        update: {},
        create: {
          ...category,
          userId: defaultUser.id,
          isSystem: true,
        },
      });
      createdCategories.push(createdCategory);
    } catch (error) {
      console.log(`Category ${category.name} already exists or creation failed`);
    }
  }

  console.log('✅ Default categories created/updated');

  // Note: Sample transactions removed for production environment
  // Only essential structure is created (user, account, categories)

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
