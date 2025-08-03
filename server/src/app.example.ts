/**
 * 🚀 Estrutura Completa de Backend - Will Finance 5.0
 * 
 * Este arquivo demonstra como integrar todos os módulos criados
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Importar módulos de autenticação
import { AuthModule } from './modules/auth/auth.module';
import { authenticateToken, requireRole } from './shared/middleware/authenticateToken';

// Importar outros módulos (a serem criados)
import { TransactionModule } from './modules/transactions/transaction.module';
import { BudgetModule } from './modules/budgets/budget.module';
import { CategoryModule } from './modules/categories/category.module';
import { ReportModule } from './modules/reports/report.module';

// Middleware e utilitários
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 8080;

// =====================================================
// 🔧 Configurações Básicas de Segurança
// =====================================================

// Helmet para headers de segurança
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

// Compressão de respostas
app.use(compression());

// Rate limiting geral
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // máximo 1000 requests por IP por janela
  message: { 
    error: 'Muitas requisições deste IP, tente novamente em 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(generalLimiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Parse JSON e URL encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =====================================================
// 📊 Health Check e Monitoramento
// =====================================================

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '5.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

app.get('/api', (req, res) => {
  res.json({
    name: 'Will Finance 5.0 API',
    version: '5.0.0',
    description: 'Sistema completo de gestão financeira pessoal',
    documentation: '/api-docs',
    health: '/health',
    endpoints: {
      auth: '/api/auth',
      transactions: '/api/transactions',
      budgets: '/api/budgets',
      categories: '/api/categories',
      reports: '/api/reports'
    }
  });
});

// =====================================================
// 🔐 Módulos da Aplicação
// =====================================================

// Instanciar módulos
const authModule = new AuthModule();
const transactionModule = new TransactionModule();
const budgetModule = new BudgetModule();
const categoryModule = new CategoryModule();
const reportModule = new ReportModule();

// Aplicar rotas dos módulos
app.use('/api/auth', authModule.getRouter());
app.use('/api/transactions', authenticateToken, transactionModule.getRouter());
app.use('/api/budgets', authenticateToken, budgetModule.getRouter());
app.use('/api/categories', authenticateToken, categoryModule.getRouter());
app.use('/api/reports', authenticateToken, reportModule.getRouter());

// =====================================================
// 🔒 Rotas Administrativas (Exemplo)
// =====================================================

app.get('/api/admin/users', 
  authenticateToken, 
  requireRole('ADMIN'), 
  async (req, res) => {
    try {
      // Lógica para listar usuários (apenas admin)
      res.json({
        success: true,
        message: 'Lista de usuários',
        data: []
      });
    } catch (error) {
      logger.error('Erro ao listar usuários:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// =====================================================
// 🛠️ Middleware de Tratamento de Erros
// =====================================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
    error: 'NOT_FOUND',
    availableEndpoints: [
      'GET /api',
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/transactions',
      'POST /api/transactions',
      'GET /api/budgets',
      'POST /api/budgets'
    ]
  });
});

// Error handler geral
app.use(errorHandler);

// =====================================================
// 🚀 Inicialização do Servidor
// =====================================================

app.listen(PORT, () => {
  logger.info(`🚀 Will Finance 5.0 Server iniciado na porta ${PORT}`);
  logger.info(`📊 Health Check: http://localhost:${PORT}/health`);
  logger.info(`🔗 API Root: http://localhost:${PORT}/api`);
  logger.info(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Log de rotas disponíveis
  logger.info('📋 Rotas disponíveis:');
  logger.info('   🔐 Auth: /api/auth');
  logger.info('   💰 Transactions: /api/transactions');
  logger.info('   📊 Budgets: /api/budgets');
  logger.info('   🏷️ Categories: /api/categories');
  logger.info('   📈 Reports: /api/reports');
});

// =====================================================
// 🛡️ Tratamento de Sinais do Sistema
// =====================================================

process.on('SIGTERM', () => {
  logger.info('🛑 SIGTERM recebido, encerrando servidor graciosamente...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('🛑 SIGINT recebido, encerrando servidor graciosamente...');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('🚨 Unhandled Promise Rejection:', reason);
  // Em produção, você pode querer encerrar o processo
  // process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

export default app;
