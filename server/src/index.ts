import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import transactionRoutes from './modules/transactions/routes/transactionSimpleRoutes';

const app = express();
const PORT = process.env.PORT || 8080;
const prisma = new PrismaClient();

// Security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);
app.use(compression());

// Rate limiting
if (process.env.NODE_ENV !== 'production') {
  // Desativa rate limit em dev
  // console.info('Rate limit desativado para desenvolvimento');
} else {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);
}

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Will Finance 5.1 API - Organized Version',
    version: '1.0.0',
    health: '/health',
    transactions: '/api/transactions',
    categories: '/api/categories',
    accounts: '/api/accounts',
    dashboard: '/api/dashboard/stats',
  });
});

// API routes using organized modules
app.use('/api/transactions', transactionRoutes);

// User sync endpoint (create or update user from Firebase)
app.post('/api/users/sync', async (req, res) => {
  try {
    const { id, email, name, avatar } = req.body;

    if (!id || !email) {
      return res.status(400).json({
        success: false,
        error: 'User ID and email are required',
      });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { id },
    });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { id },
        data: {
          email,
          name: name || user.name,
          avatar: avatar || user.avatar,
          isActive: true,
          emailVerified: true,
        },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          id,
          email,
          name: name || email.split('@')[0],
          avatar: avatar || null,
          role: 'USER',
          isActive: true,
          emailVerified: true,
          password: 'firebase-auth', // Firebase users don't need local password
        },
      });

      // Create default account for new user
      const existingAccount = await prisma.account.findFirst({
        where: {
          userId: id,
          name: 'Conta Principal',
        },
      });

      if (!existingAccount) {
        await prisma.account.create({
          data: {
            id: `${id}-default-account`,
            name: 'Conta Principal',
            type: 'CHECKING',
            balance: 0,
            currency: 'BRL',
            isActive: true,
            userId: id,
            color: '#3B82F6',
            icon: 'wallet',
            description: 'Conta padrão do usuário',
          },
        });
      }

      // Create default categories for new user
      const defaultCategories = [
        { name: 'Alimentação', icon: 'utensils', color: '#ef4444', type: 'EXPENSE' },
        { name: 'Transporte', icon: 'car', color: '#f97316', type: 'EXPENSE' },
        { name: 'Moradia', icon: 'home', color: '#8b5cf6', type: 'EXPENSE' },
        { name: 'Saúde', icon: 'heart', color: '#ec4899', type: 'EXPENSE' },
        { name: 'Educação', icon: 'book', color: '#10b981', type: 'EXPENSE' },
        { name: 'Lazer', icon: 'film', color: '#8b5cf6', type: 'EXPENSE' },
        { name: 'Compras', icon: 'shopping-bag', color: '#eab308', type: 'EXPENSE' },
        { name: 'Utilidades', icon: 'file-text', color: '#06b6d4', type: 'EXPENSE' },
        { name: 'Outros Gastos', icon: 'more-horizontal', color: '#6b7280', type: 'EXPENSE' },
        { name: 'Salário', icon: 'dollar-sign', color: '#22c55e', type: 'INCOME' },
        { name: 'Freelance', icon: 'briefcase', color: '#059669', type: 'INCOME' },
        { name: 'Investimentos', icon: 'trending-up', color: '#0d9488', type: 'INCOME' },
        { name: 'Vendas', icon: 'shopping-cart', color: '#16a34a', type: 'INCOME' },
        { name: 'Outras Receitas', icon: 'more-horizontal', color: '#6b7280', type: 'INCOME' },
      ];

      for (const category of defaultCategories) {
        // Verificar se a categoria já existe para este usuário
        const existingCategory = await prisma.category.findFirst({
          where: {
            name: category.name,
            userId: id,
            type: category.type,
          },
        });

        if (!existingCategory) {
          await prisma.category.create({
            data: {
              ...category,
              userId: id,
              isSystem: true,
            },
          });
        }
      }
    }

    res.json({
      success: true,
      data: user,
      message: 'User synchronized successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to sync user',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Categories endpoint
app.get('/api/categories', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }
    
    const categories = await prisma.category.findMany({
      where: { 
        isActive: true,
        userId: userId as string,
      },
      orderBy: { name: 'asc' },
    });
    
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Accounts endpoint
app.get('/api/accounts', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }
    
    const accounts = await prisma.account.findMany({
      where: { 
        isActive: true,
        userId: userId as string,
      },
      orderBy: { name: 'asc' },
    });
    
    res.json({
      success: true,
      data: accounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch accounts',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    // Get the default user
    const defaultUser = await prisma.user.findFirst({
      where: { email: 'admin@willfinance.com' },
    });
    
    if (!defaultUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }
    
    // Use default user for stats
    const [totalIncome, totalExpenses, transactionCount] = await Promise.all([
      prisma.transaction.aggregate({
        where: { type: 'INCOME', userId: defaultUser.id },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { type: 'EXPENSE', userId: defaultUser.id },
        _sum: { amount: true },
      }),
      prisma.transaction.count({
        where: { userId: defaultUser.id },
      }),
    ]);

    const income = totalIncome._sum.amount || 0;
    const expenses = totalExpenses._sum.amount || 0;
    const balance = income - expenses;

    res.json({
      success: true,
      data: {
        income,
        expenses,
        balance,
        transactionCount,
      },
    });
  } catch (error) {
    // console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Reports endpoint
app.get('/api/reports', async (req, res) => {
  try {
    // Get the default user
    const defaultUser = await prisma.user.findFirst({
      where: { email: 'admin@willfinance.com' },
    });
    
    if (!defaultUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Get all transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: { userId: defaultUser.id },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate overview stats
    const income = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const expenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Calculate monthly trends (last 6 months)
    const now = new Date();
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.createdAt);
        return transactionDate >= date && transactionDate < nextMonth;
      });
      
      const monthIncome = monthTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const monthExpenses = monthTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      monthlyTrends.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        income: monthIncome,
        expenses: monthExpenses,
      });
    }

    // Calculate categories
    const categoryMap = new Map();
    transactions.filter(t => t.type === 'EXPENSE').forEach(t => {
      const category = t.category || 'Outros';
      const current = categoryMap.get(category) || 0;
      categoryMap.set(category, current + Number(t.amount));
    });

    const totalCategoryExpenses = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);
    const categories = Array.from(categoryMap.entries()).map(([name, amount], index) => ({
      name,
      amount,
      percentage: totalCategoryExpenses > 0 ? (amount / totalCategoryExpenses) * 100 : 0,
      color: `hsl(${(index * 137.508) % 360}, 70%, 60%)`, // Golden angle for good color distribution
    }));

    res.json({
      success: true,
      reports: {
        overview: {
          totalIncome: income,
          totalExpenses: expenses,
          netIncome: income - expenses,
          transactionCount: transactions.length,
        },
        monthlyTrends,
        categories,
      },
    });
  } catch (error) {
    // console.error('Reports error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reports',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// File upload/import endpoint
app.post('/api/import/transactions', async (req, res) => {
  try {
    const { file } = req.body;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided',
      });
    }

    // For now, return a mock success response
    // In a real implementation, you would parse the CSV/Excel file
    res.json({
      success: true,
      data: {
        imported: 0,
        errors: [],
        message: 'Import functionality will be implemented soon',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to import transactions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Import preview endpoint
app.post('/api/import-export/preview', async (req, res) => {
  try {
    // Mock preview data since we don't have actual file processing yet
    res.json({
      success: true,
      preview: {
        bankDetected: 'Banco Genérico',
        totalTransactions: 0,
        summary: {
          income: 0,
          expenses: 0,
          balance: 0,
        },
        sampleTransactions: [],
        filename: 'arquivo.csv',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to preview file',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Import process endpoint
app.post('/api/import-export/process', async (req, res) => {
  try {
    // Mock import process
    res.json({
      success: true,
      stats: {
        importedCount: 0,
        duplicateCount: 0,
        totalProcessed: 0,
        accountName: 'Mock Account',
        bankDetected: 'Banco Genérico',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process import',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Export endpoint
app.get('/api/import-export/export', async (req, res) => {
  try {
    const { format, startDate, endDate } = req.query;

    // Get the default user
    const defaultUser = await prisma.user.findFirst({
      where: { email: 'admin@willfinance.com' },
    });
    
    if (!defaultUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Build where clause for date filtering
    const where: Record<string, unknown> = { userId: defaultUser.id };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        (where.createdAt as Record<string, Date>).gte = new Date(startDate as string);
      }
      if (endDate) {
        (where.createdAt as Record<string, Date>).lte = new Date(endDate as string);
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'csv') {
      // Generate CSV
      const csvHeaders = 'Data,Descrição,Categoria,Tipo,Valor\n';
      const csvData = transactions.map(t => 
        `${t.createdAt.toLocaleDateString('pt-BR')},${t.description},${t.categoryId || 'N/A'},${t.type},${t.amount}`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=transacoes.csv');
      res.send(csvHeaders + csvData);
    } else {
      // Return JSON
      res.json({
        success: true,
        data: transactions,
        count: transactions.length,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to export data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested endpoint does not exist',
    availableEndpoints: [
      '/api',
      '/health',
      '/api/transactions',
      '/api/categories',
      '/api/accounts',
      '/api/dashboard/stats',
      '/api/reports',
      '/api/import/transactions',
      '/api/import-export/preview',
      '/api/import-export/process',
      '/api/import-export/export',
    ],
  });
});

// Error handler
app.use((error: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message,
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server running on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  // eslint-disable-next-line no-console
  console.log(`🔗 API Root: http://localhost:${PORT}/api`);
  // eslint-disable-next-line no-console
  console.log(`💰 Transactions: http://localhost:${PORT}/api/transactions`);
  // eslint-disable-next-line no-console
  console.log(`📂 Categories: http://localhost:${PORT}/api/categories`);
  // eslint-disable-next-line no-console
  console.log(`🏦 Accounts: http://localhost:${PORT}/api/accounts`);
  // eslint-disable-next-line no-console
  console.log(`📈 Dashboard: http://localhost:${PORT}/api/dashboard/stats`);
  // eslint-disable-next-line no-console
  console.log(`📊 Reports: http://localhost:${PORT}/api/reports`);
});
