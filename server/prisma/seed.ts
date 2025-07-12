import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed process...');

  // Create default categories
  const categories = [
    { name: 'Food & Dining', icon: '🍽️', color: '#ff6b6b', type: 'expense' },
    { name: 'Transportation', icon: '🚗', color: '#4ecdc4', type: 'expense' },
    { name: 'Shopping', icon: '🛍️', color: '#45b7d1', type: 'expense' },
    { name: 'Entertainment', icon: '🎬', color: '#f39c12', type: 'expense' },
    { name: 'Bills & Utilities', icon: '💡', color: '#e74c3c', type: 'expense' },
    { name: 'Healthcare', icon: '🏥', color: '#2ecc71', type: 'expense' },
    { name: 'Education', icon: '📚', color: '#9b59b6', type: 'expense' },
    { name: 'Travel', icon: '✈️', color: '#1abc9c', type: 'expense' },
    { name: 'Salary', icon: '💼', color: '#27ae60', type: 'income' },
    { name: 'Business', icon: '🏢', color: '#2980b9', type: 'income' },
    { name: 'Investments', icon: '📈', color: '#8e44ad', type: 'income' },
    { name: 'Other Income', icon: '💰', color: '#f1c40f', type: 'income' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('✅ Categories created');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 12);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@willfinance.com' },
    update: {},
    create: {
      email: 'demo@willfinance.com',
      name: 'Demo User',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
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

  const savingsAccount = await prisma.account.create({
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
    await prisma.transaction.create({
      data: transaction,
    });
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
    },
    {
      name: 'Transportation Budget',
      amount: 300.00,
      spent: 120.00,
      period: 'monthly',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      userId: demoUser.id,
    },
    {
      name: 'Annual Vacation Fund',
      amount: 5000.00,
      spent: 0.00,
      period: 'yearly',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      userId: demoUser.id,
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
      deadline: new Date('2024-12-31'),
      userId: demoUser.id,
    },
    {
      name: 'New Car',
      description: 'Save for a new car down payment',
      targetAmount: 10000.00,
      currentAmount: 3500.00,
      deadline: new Date('2024-06-30'),
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