import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';

import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { setupSocketIO } from './config/socket';
import { initializeFirebaseAdmin } from './config/firebase';

// Routes
import authRoutes from './routes/auth';
import adminAuthRoutes from './routes/adminAuth';
import googleAuthRoutes from './routes/googleAuth';
import userRoutes from './routes/users';
import accountRoutes from './routes/accounts';
import transactionRoutes from './routes/transactions';
import categoryRoutes from './routes/categories';
import budgetRoutes from './routes/budgets';
import goalRoutes from './routes/goals';
import analyticsRoutes from './routes/analytics';
import aiRoutes from './routes/ai';
import notificationRoutes from './routes/notifications';
import importExportRoutes from './routes/importExport';
import dataModeRoutes from './routes/dataMode';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT ?? 8080;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "ws:", "wss:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', // Porta padrão do Vite
    'http://localhost:5174', // Porta alternativa do Vite
    'http://localhost:3000',
    'http://localhost:8080',
    process.env.CLIENT_URL ?? 'http://localhost:5173'
  ],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? '100'), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '1.0.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/auth/google', googleAuthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/import-export', importExportRoutes);
app.use('/api/data-mode', dataModeRoutes);

// Serve static files from client build
const clientBuildPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'The requested API endpoint was not found.',
    });
  }
  
  // Serve index.html for all other routes (SPA)
  return res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

// Database and Redis connections
async function startServer() {
  try {
    console.log('🚀 Starting server initialization...');
    
    // Initialize Firebase Admin SDK
    console.log('🔥 Initializing Firebase Admin SDK...');
    logger.info('🔥 Initializing Firebase Admin SDK...');
    initializeFirebaseAdmin();
    console.log('✅ Firebase Admin SDK initialized');
    logger.info('✅ Firebase Admin SDK initialized');

    // Connect to database
    console.log('📦 Connecting to database...');
    logger.info('Connecting to database...');
    await connectDatabase();
    console.log('✅ Database connected successfully');
    logger.info('✅ Database connected successfully');

    // Connect to Redis (sempre habilitado com mock em desenvolvimento)
    try {
      logger.info('Conectando ao Redis...');
      await connectRedis();
      logger.info('✅ Redis conectado com sucesso');
    } catch (error) {
      logger.error('❌ Falha ao conectar Redis:', error);
      // Não parar o servidor se Redis falhar
    }

    // Setup Socket.IO
    logger.info('Setting up Socket.IO...');
    setupSocketIO(io);
    logger.info('✅ Socket.IO configured successfully');

    // Start server
    console.log(`🚀 Starting server on port ${PORT}...`);
    logger.info(`Starting server on port ${PORT}...`);
    server.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`🌐 API URL: http://localhost:${PORT}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/health`);
      logger.info(`🎯 Environment: ${process.env.NODE_ENV ?? 'development'}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  server.close(() => {
    process.exit(1);
  });
});

startServer();

export { io };
