import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Sample users data
const SAMPLE_USERS = [
  {
    email: 'admin@willfinance.com',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    password: 'admin123',
    isAdmin: true
  },
  {
    email: 'demo@willfinance.com',
    username: 'demo',
    firstName: 'Demo',
    lastName: 'User',
    password: 'demo123',
    isAdmin: false
  },
  {
    email: 'william@willfinance.com',
    username: 'william',
    firstName: 'William',
    lastName: 'Finance',
    password: 'william123',
    isAdmin: false
  }
];

// Sample categories
const SAMPLE_CATEGORIES = [
  // Income categories
  { name: 'Salário', type: 'INCOME', icon: 'briefcase', color: '#10B981' },
  { name: 'Freelance', type: 'INCOME', icon: 'laptop', color: '#059669' },
  { name: 'Investimentos', type: 'INCOME', icon: 'trending-up', color: '#34D399' },
  { name: 'Vendas', type: 'INCOME', icon: 'shopping-bag', color: '#6EE7B7' },
  
  // Expense categories
  { name: 'Alimentação', type: 'EXPENSE', icon: 'utensils', color: '#EF4444' },
  { name: 'Transporte', type: 'EXPENSE', icon: 'car', color: '#DC2626' },
  { name: 'Moradia', type: 'EXPENSE', icon: 'home', color: '#B91C1C' },
  { name: 'Saúde', type: 'EXPENSE', icon: 'heart', color: '#991B1B' },
  { name: 'Educação', type: 'EXPENSE', icon: 'book', color: '#7F1D1D' },
  { name: 'Entretenimento', type: 'EXPENSE', icon: 'music', color: '#FEA5A5' },
  { name: 'Roupas', type: 'EXPENSE', icon: 'shirt', color: '#FCA5A5' },
  { name: 'Tecnologia', type: 'EXPENSE', icon: 'smartphone', color: '#F87171' },
  { name: 'Serviços', type: 'EXPENSE', icon: 'wrench', color: '#EF4444' },
  { name: 'Outros', type: 'EXPENSE', icon: 'more-horizontal', color: '#DC2626' }
];

// Sample accounts
const SAMPLE_ACCOUNTS = [
  {
    name: 'Conta Corrente Principal',
    type: 'CHECKING',
    balance: 5000.00,
    color: '#3B82F6',
    icon: 'credit-card',
    bankName: 'Banco do Brasil'
  },
  {
    name: 'Poupança',
    type: 'SAVINGS',
    balance: 15000.00,
    color: '#10B981',
    icon: 'piggy-bank',
    bankName: 'Caixa Econômica'
  },
  {
    name: 'Cartão de Crédito',
    type: 'CREDIT_CARD',
    balance: -1200.00,
    color: '#F59E0B',
    icon: 'credit-card',
    bankName: 'Nubank',
    creditLimit: 5000.00,
    dueDay: 10,
    closingDay: 5
  },
  {
    name: 'Investimentos',
    type: 'INVESTMENT',
    balance: 25000.00,
    color: '#8B5CF6',
    icon: 'trending-up',
    bankName: 'XP Investimentos'
  }
];

// Sample transactions generator
function generateSampleTransactions(userId: string, accounts: any[], categories: any[]) {
  const transactions = [];
  const now = new Date();
  
  // Generate transactions for the last 6 months
  for (let i = 0; i < 180; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random number of transactions per day (0-3)
    const transactionsPerDay = Math.floor(Math.random() * 4);
    
    for (let j = 0; j < transactionsPerDay; j++) {
      const isIncome = Math.random() < 0.3; // 30% chance of income
      const availableCategories = categories.filter(cat => 
        cat.type === (isIncome ? 'INCOME' : 'EXPENSE')
      );
      
      const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
      const account = accounts[Math.floor(Math.random() * accounts.length)];
      
      let amount;
      let description;
      
      if (isIncome) {
        amount = Math.floor(Math.random() * 5000) + 500; // R$ 500 - R$ 5500
        description = `Receita - ${category.name}`;
      } else {
        amount = Math.floor(Math.random() * 300) + 10; // R$ 10 - R$ 310
        description = `Gasto - ${category.name}`;
      }
      
      transactions.push({
        amount: isIncome ? amount : -amount,
        description,
        date,
        type: isIncome ? 'INCOME' : 'EXPENSE',
        status: 'COMPLETED',
        userId,
        accountId: account.id,
        categoryId: category.id,
        notes: Math.random() < 0.3 ? 'Transação automática gerada para demonstração' : null
      });
    }
  }
  
  return transactions;
}

// Sample goals
const SAMPLE_GOALS = [
  {
    name: 'Fundo de Emergência',
    description: 'Reserva para 6 meses de gastos',
    targetAmount: 30000.00,
    currentAmount: 15000.00,
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 12)),
    color: '#10B981',
    icon: 'shield'
  },
  {
    name: 'Viagem para Europa',
    description: 'Férias de verão na Europa',
    targetAmount: 15000.00,
    currentAmount: 8500.00,
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 8)),
    color: '#3B82F6',
    icon: 'plane'
  },
  {
    name: 'Novo Carro',
    description: 'Compra de um carro novo',
    targetAmount: 45000.00,
    currentAmount: 12000.00,
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 18)),
    color: '#F59E0B',
    icon: 'car'
  }
];

// Sample budgets
function generateSampleBudgets(userId: string, categories: any[]) {
  const expenseCategories = categories.filter(cat => cat.type === 'EXPENSE');
  const budgets = [];
  
  expenseCategories.forEach(category => {
    if (Math.random() < 0.6) { // 60% chance of having a budget
      const amount = Math.floor(Math.random() * 1000) + 200; // R$ 200 - R$ 1200
      const spent = Math.floor(amount * Math.random() * 0.8); // 0-80% spent
      
      budgets.push({
        name: `Orçamento ${category.name}`,
        amount,
        spent,
        period: 'MONTHLY',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        alertPercentage: 80,
        userId,
        categoryId: category.id
      });
    }
  });
  
  return budgets;
}

async function main() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Clear existing data (in reverse order due to foreign keys)
    console.log('🧹 Cleaning existing data...');
    await prisma.aiInsight.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.budget.deleteMany({});
    await prisma.goal.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.user.deleteMany({});
    
    // Create users
    console.log('👥 Creating users...');
    const users = [];
    for (const userData of SAMPLE_USERS) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          password: hashedPassword,
          emailVerified: true,
          emailVerifiedAt: new Date(),
          currency: 'BRL',
          language: 'pt-BR',
          theme: 'cyberpunk'
        }
      });
      users.push(user);
    }
    
    // Create system categories
    console.log('📁 Creating categories...');
    const categories = [];
    for (const categoryData of SAMPLE_CATEGORIES) {
      const category = await prisma.category.create({
        data: {
          ...categoryData,
          isSystem: true,
          isActive: true
        }
      });
      categories.push(category);
    }
    
    // For each user, create accounts, transactions, goals, and budgets
    for (const user of users) {
      console.log(`💼 Creating data for user: ${user.firstName}...`);
      
      // Create accounts
      const userAccounts = [];
      for (const accountData of SAMPLE_ACCOUNTS) {
        const account = await prisma.account.create({
          data: {
            ...accountData,
            userId: user.id
          }
        });
        userAccounts.push(account);
      }
      
      // Create goals
      for (const goalData of SAMPLE_GOALS) {
        await prisma.goal.create({
          data: {
            ...goalData,
            userId: user.id
          }
        });
      }
      
      // Create budgets
      const budgets = generateSampleBudgets(user.id, categories);
      for (const budgetData of budgets) {
        await prisma.budget.create({
          data: budgetData
        });
      }
      
      // Create transactions
      const transactions = generateSampleTransactions(user.id, userAccounts, categories);
      console.log(`💳 Creating ${transactions.length} transactions...`);
      
      // Insert transactions in batches to avoid memory issues
      const batchSize = 100;
      for (let i = 0; i < transactions.length; i += batchSize) {
        const batch = transactions.slice(i, i + batchSize);
        await prisma.transaction.createMany({
          data: batch
        });
      }
      
      // Update account balances based on transactions
      for (const account of userAccounts) {
        const accountTransactions = transactions.filter(t => t.accountId === account.id);
        const totalAmount = accountTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        await prisma.account.update({
          where: { id: account.id },
          data: { balance: account.balance + totalAmount }
        });
      }
      
      // Create some sample notifications
      await prisma.notification.createMany({
        data: [
          {
            title: 'Bem-vindo ao Will Finance!',
            message: 'Sua conta foi criada com sucesso. Explore todas as funcionalidades!',
            type: 'INFO',
            userId: user.id
          },
          {
            title: 'Orçamento próximo do limite',
            message: 'Seu orçamento de Alimentação está em 85% do limite mensal.',
            type: 'WARNING',
            userId: user.id
          },
          {
            title: 'Meta atingida!',
            message: 'Parabéns! Você atingiu 50% da sua meta de Fundo de Emergência.',
            type: 'SUCCESS',
            userId: user.id
          }
        ]
      });
    }
    
    console.log('✅ Database seeding completed successfully!');
    console.log(`Created: ${users.length} users, ${categories.length} categories`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });