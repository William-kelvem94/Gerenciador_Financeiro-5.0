import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando configuração do banco de dados...');

  // Criar categorias padrão do sistema (sem dados fictícios)
  const systemCategories = [
    { name: 'Alimentação', icon: '🍽️', color: '#ff6b6b', type: 'expense' },
    { name: 'Transporte', icon: '🚗', color: '#4ecdc4', type: 'expense' },
    { name: 'Compras', icon: '🛍️', color: '#45b7d1', type: 'expense' },
    { name: 'Entretenimento', icon: '🎬', color: '#f39c12', type: 'expense' },
    { name: 'Contas e Utilidades', icon: '💡', color: '#e74c3c', type: 'expense' },
    { name: 'Saúde', icon: '🏥', color: '#2ecc71', type: 'expense' },
    { name: 'Educação', icon: '📚', color: '#9b59b6', type: 'expense' },
    { name: 'Viagem', icon: '✈️', color: '#1abc9c', type: 'expense' },
    { name: 'Salário', icon: '💼', color: '#27ae60', type: 'income' },
    { name: 'Negócios', icon: '🏢', color: '#2980b9', type: 'income' },
    { name: 'Investimentos', icon: '📈', color: '#8e44ad', type: 'income' },
    { name: 'Outras Receitas', icon: '💰', color: '#f1c40f', type: 'income' },
    { name: 'Outras Despesas', icon: '❓', color: '#95a5a6', type: 'expense' },
  ];

  // Criar apenas categorias do sistema (sem dados de usuário)
  for (const category of systemCategories) {
    try {
      const existing = await prisma.category.findFirst({
        where: {
          name: category.name,
          userId: null
        }
      });

      if (!existing) {
        await prisma.category.create({
          data: {
            ...category,
            isSystem: true,
            userId: null,
          },
        });
        console.log(`✅ Categoria "${category.name}" criada`);
      } else {
        console.log(`ℹ️ Categoria "${category.name}" já existe`);
      }
    } catch (error: any) {
      console.error(`❌ Erro ao criar categoria "${category.name}":`, error.message);
    }
  }

  console.log('✅ Categorias do sistema configuradas');

  // Create demo user
  console.log('ℹ️ Creating demo user for development');
  const demoUser = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@willfinance.com',
      password: await bcrypt.hash('demo123', 10),
    },
  });

  console.log('✅ Demo user created');

  // Create demo accounts
  const checkingAccount = await prisma.account.create({
    data: {
      name: 'Checking Account',
      type: 'checking',
      balance: 2500.75,
      currency: 'BRL',
      userId: demoUser.id,
    },
  });

  await prisma.account.create({
    data: {
      name: 'Savings Account',
      type: 'savings',
      balance: 15000.00,
      currency: 'BRL',
      userId: demoUser.id,
    },
  });

  console.log('✅ Demo accounts created');

  // Get categories for transactions
  const foodCategory = await prisma.category.findFirst({ where: { name: 'Food & Dining' } });
  const salaryCategory = await prisma.category.findFirst({ where: { name: 'Salary' } });
  const transportCategory = await prisma.category.findFirst({ where: { name: 'Transportation' } });
  const billsCategory = await prisma.category.findFirst({ where: { name: 'Bills & Utilities' } });

  // Create demo transactions
  const transactions = [
    {
      amount: 3500.00,
      description: 'Monthly Salary',
      type: 'income',
      date: new Date('2024-01-01'),
      userId: demoUser.id,
      accountId: checkingAccount.id,
      categoryId: salaryCategory?.id,
    },
    {
      amount: 45.50,
      description: 'Grocery Shopping',
      type: 'expense',
      date: new Date('2024-01-02'),
      userId: demoUser.id,
      accountId: checkingAccount.id,
      categoryId: foodCategory?.id,
    },
    {
      amount: 120.00,
      description: 'Gas Station',
      type: 'expense',
      date: new Date('2024-01-03'),
      userId: demoUser.id,
      accountId: checkingAccount.id,
      categoryId: transportCategory?.id,
    },
    {
      amount: 250.00,
      description: 'Electricity Bill',
      type: 'expense',
      date: new Date('2024-01-05'),
      userId: demoUser.id,
      accountId: checkingAccount.id,
      categoryId: billsCategory?.id,
    },
    {
      amount: 89.90,
      description: 'Restaurant',
      type: 'expense',
      date: new Date('2024-01-07'),
      userId: demoUser.id,
      accountId: checkingAccount.id,
      categoryId: foodCategory?.id,
    },
  ];

  for (const transaction of transactions) {
    if (transaction.categoryId) {
      await prisma.transaction.create({
        data: transaction as any,
      });
    }
  }

  console.log('✅ Demo transactions created');

  // Create demo budgets
  const budgets = [
    {
      name: 'Monthly Food Budget',
      amount: 600.00,
      spent: 135.40,
      period: 'monthly',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      userId: demoUser.id,
      categoryId: foodCategory?.id || '',
    },
    {
      name: 'Transportation Budget',
      amount: 300.00,
      spent: 120.00,
      period: 'monthly',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      userId: demoUser.id,
      categoryId: transportCategory?.id || '',
    },
    {
      name: 'Bills Budget',
      amount: 500.00,
      spent: 250.00,
      period: 'monthly',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      userId: demoUser.id,
      categoryId: billsCategory?.id || '',
    },
  ];

  for (const budget of budgets) {
    await prisma.budget.create({
      data: budget,
    });
  }

  console.log('✅ Demo budgets created');

  // Create demo goals
  const goals = [
    {
      name: 'Emergency Fund',
      description: 'Build emergency fund for 6 months of expenses',
      targetAmount: 20000.00,
      currentAmount: 15000.00,
      targetDate: new Date('2024-12-31'),
      userId: demoUser.id,
    },
    {
      name: 'New Car',
      description: 'Save for a new car down payment',
      targetAmount: 10000.00,
      currentAmount: 3500.00,
      targetDate: new Date('2024-06-30'),
      userId: demoUser.id,
    },
  ];

  for (const goal of goals) {
    await prisma.goal.create({
      data: goal,
    });
  }

  console.log('✅ Demo goals created');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('Demo login credentials:');
  console.log('Email: demo@willfinance.com');
  console.log('Password: demo123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });