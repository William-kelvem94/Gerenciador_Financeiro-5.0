import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';

import errorHandler from '../../client/server/src/middleware/errorHandler';
import { logger } from '../../client/server/src/utils/logger';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { setupSocketIO } from './config/socket';
import { initializeFirebaseAdmin } from './config/firebase';

// Route imports centralized
import authRoutes from './routes/auth';
import adminRoutes from './routes/adminAuth';
import googleAuthRoutes from './routes/googleAuth';
import usersRoutes from './routes/users';
import accountsRoutes from './routes/accounts';
import transactionsRoutes from './routes/transactions';
import categoriesRoutes from './routes/categories';
import budgetsRoutes from './routes/budgets';
import goalsRoutes from './routes/goals';
import analyticsRoutes from './routes/analytics';
import aiRoutes from './routes/ai';
import notificationsRoutes from './routes/notifications';
import importExportRoutes from './routes/importExport';
import dataModeRoutes from './routes/dataMode';

const routes: Record<string, express.Router> = {
  auth: authRoutes,
  admin: adminRoutes,
  'auth/google': googleAuthRoutes,
  users: usersRoutes,
  accounts: accountsRoutes,
  transactions: transactionsRoutes,
  categories: categoriesRoutes,
  budgets: budgetsRoutes,
  goals: goalsRoutes,
  analytics: analyticsRoutes,
  ai: aiRoutes,
  notifications: notificationsRoutes,
  'import-export': importExportRoutes,
  'data-mode': dataModeRoutes,
};

const DEFAULT_PORT = 8080;
const DEFAULT_CLIENT_URL = 'http://localhost:5173';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL ?? DEFAULT_CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const PORT = Number(process.env.PORT) || DEFAULT_PORT;

// Security middleware
function setupSecurityMiddleware() {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com',
          ],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          connectSrc: ["'self'", 'ws:', 'wss:', 'https:'],
        },
      },
    }),
  );
  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:3000',
        'http://localhost:8080',
        process.env.CLIENT_URL ?? DEFAULT_CLIENT_URL,
      ],
      credentials: true,
    }),
  );
  const limiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
      error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);
}

// Body parsing
function setupAppMiddleware() {
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
}

// Static files and routes
function setupRoutesAndStaticFiles() {
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
  app.use(express.static(clientBuildPath));

  app.get('/health', (req: Request, res: Response) =>
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '1.0.0',
    }),
  );

  Object.entries(routes).forEach(([routeName, routeHandler]) => {
    app.use(`/api/${routeName}`, routeHandler);
  });

  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'The requested API endpoint was not found.',
      });
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
      if (err) next(err);
    });
  });
}

// Service initialization
async function initializeServices() {
  logger.info('🚀 Starting server initialization...');
  logger.info('🔥 Initializing Firebase Admin SDK...');
  initializeFirebaseAdmin();
  logger.info('✅ Firebase Admin SDK initialized');

  logger.info('📦 Connecting to database...');
  await connectDatabase();
  logger.info('✅ Database connected successfully');

  try {
    logger.info('Conectando ao Redis...');
    await connectRedis();
    logger.info('✅ Redis conectado com sucesso');
  } catch (error) {
    logger.error('❌ Falha ao conectar Redis:', error);
  }

  logger.info('Setting up Socket.IO...');
  setupSocketIO(io);
  logger.info('✅ Socket.IO configured successfully');
}

// Graceful shutdown
function gracefulShutdown(signal: string) {
  logger.info(`${signal} received, shutting down gracefully`);
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
}

function setupProcessHandlers() {
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on(
    'unhandledRejection',
    (reason: unknown, promise: Promise<unknown>) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      server.close(() => process.exit(1));
    },
  );
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    server.close(() => process.exit(1));
  });
}

// Main startup
setupSecurityMiddleware();
setupAppMiddleware();
setupRoutesAndStaticFiles();
app.use(errorHandler);

async function startServer() {
  try {
    await initializeServices();
    server.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`🌐 API URL: http://localhost:${PORT}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/health`);
      logger.info(`🎯 Environment: ${process.env.NODE_ENV ?? 'development'}`);
    });
    setupProcessHandlers();
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export { io };
