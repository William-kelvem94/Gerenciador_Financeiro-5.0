import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { logger } from './shared/logger';

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
        frameAncestors: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    // Remove headers desnecessários para APIs modernas
    xssFilter: false, // X-XSS-Protection é deprecated
    noSniff: true,
    frameguard: false, // Usamos CSP frame-ancestors ao invés
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

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
    message: 'Will Finance 5.1 API - Full Version',
    version: '1.0.0',
    health: '/health',
    transactions: '/api/transactions',
  });
});

// Transaction endpoints
app.get('/api/transactions', async (req, res) => {
  try {
    const { userId } = req.query;

    // Para desenvolvimento, aceitar requisições sem userId
    const whereClause = userId ? { userId: userId as string } : {};

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      take: 50,
    });
    
    res.json({
      success: true,
      data: transactions,
      total: transactions.length,
    });
  } catch (error) {
    logger.error('Error fetching transactions:', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body;

    // Validation
    if (!description || !amount || !type || !category || !date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['description', 'amount', 'type', 'category', 'date'],
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount: parseFloat(amount),
        type: type.toUpperCase(),
        date: new Date(date),
        userId: 'default-user', // For now, using default user
        accountId: 'default-account', // Default account ID
        categoryId: 'default-category', // Default category ID
      },
    });

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully',
    });
  } catch (error) {
    logger.error('Error creating transaction:', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to create transaction',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, type, category, date } = req.body;

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        description,
        amount: parseFloat(amount),
        type: type.toUpperCase(),
        category,
        date: new Date(date),
      },
    });

    res.json({
      success: true,
      data: transaction,
      message: 'Transaction updated successfully',
    });
  } catch (error) {
    logger.error('Error updating transaction:', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to update transaction',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.transaction.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting transaction:', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to delete transaction',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const { userId } = req.query;

    // Para desenvolvimento, aceitar requisições sem userId
    const whereClause = userId ? { userId: userId as string } : {};

    const [totalIncome, totalExpenses, transactionCount] = await Promise.all([
      prisma.transaction.aggregate({
        where: { 
          type: 'INCOME',
          ...whereClause
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { 
          type: 'EXPENSE',
          ...whereClause
        },
        _sum: { amount: true },
      }),
      prisma.transaction.count({
        where: whereClause
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
    logger.error('Error fetching dashboard stats:', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats',
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
      '/api/dashboard/stats',
    ],
  });
});

// Error handler
app.use((error: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Global error handler:', { error: error.message, stack: error.stack });
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message,
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`API Root: http://localhost:${PORT}/api`);
  logger.info(`Transactions: http://localhost:${PORT}/api/transactions`);
  logger.info(`Dashboard: http://localhost:${PORT}/api/dashboard/stats`);
});

