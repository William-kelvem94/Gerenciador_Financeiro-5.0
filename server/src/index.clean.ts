/* eslint-disable no-console */
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

// Categories endpoint
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
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
    const accounts = await prisma.account.findMany({
      where: { isActive: true },
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
    const [totalIncome, totalExpenses, transactionCount] = await Promise.all([
      prisma.transaction.aggregate({
        where: { type: 'INCOME' },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { type: 'EXPENSE' },
        _sum: { amount: true },
      }),
      prisma.transaction.count(),
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
      '/api/categories',
      '/api/accounts',
      '/api/dashboard/stats',
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
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Root: http://localhost:${PORT}/api`);
  console.log(`💰 Transactions: http://localhost:${PORT}/api/transactions`);
  console.log(`📂 Categories: http://localhost:${PORT}/api/categories`);
  console.log(`🏦 Accounts: http://localhost:${PORT}/api/accounts`);
  console.log(`📈 Dashboard: http://localhost:${PORT}/api/dashboard/stats`);
});
