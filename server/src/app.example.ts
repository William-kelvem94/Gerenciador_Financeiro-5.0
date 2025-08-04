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

// Importar outros módulos (a serem criados - comentados até implementação)
// import { TransactionModule } from './modules/transactions/transaction.module';
// import { BudgetModule } from './modules/budgets/budget.module';
// import { CategoryModule } from './modules/categories/category.module';
// import { ReportModule } from './modules/reports/report.module';

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
      styleSrc: ["'self'", process.env.NODE_ENV === 'development' ? "'unsafe-inline'" : "'self'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Compressão de respostas
app.use(compression());

// Rate limiting geral
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === 'production' ? 500 : 1000, // reduzido para produção
  message: { 
    error: 'Muitas requisições deste IP, tente novamente em 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting para rotas sensíveis (auth)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === 'production' ? 20 : 100, // muito mais restritivo
  message: { 
    error: 'Muitas tentativas de autenticação, tente novamente em 15 minutos.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

// CORS com configuração melhorada
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CLIENT_URL!, 'https://willfinance.app'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'X-CSRF-Token'
  ],
  optionsSuccessStatus: 200 // alguns browsers legados falham com 204
};

app.use(cors(corsOptions));

// Middleware de logging e headers de segurança
app.use((req, res, next) => {
  // Logging de requisições
  logger.info(`${req.method} ${req.path} - IP: ${req.ip}`);
  
  // Headers de segurança adicionais
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
});

// Parse JSON e URL encoded com limites configuráveis
const jsonLimit = process.env.JSON_LIMIT || '10mb';
const urlencodedLimit = process.env.URLENCODED_LIMIT || '10mb';

app.use(express.json({ limit: jsonLimit }));
app.use(express.urlencoded({ extended: true, limit: urlencodedLimit }));

// =====================================================
// 📊 Health Check e Monitoramento
// =====================================================

app.get('/health', async (req, res) => {
  try {
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '5.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      // TODO: Adicionar verificação de conexão com banco de dados
      // database: await checkDatabaseConnection(),
      services: {
        api: 'healthy',
        // TODO: adicionar outros serviços
      }
    };
    
    res.json(healthData);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Service temporarily unavailable'
    });
  }
});

app.get('/api', (req, res) => {
  res.json({
    name: 'Will Finance 5.0 API',
    version: '5.0.0',
    description: 'Sistema completo de gestão financeira pessoal',
    documentation: '/api-docs',
    health: '/health',
    endpoints: {
      auth: '/api/v1/auth',
      // TODO: Adicionar quando os módulos forem implementados
      // transactions: '/api/v1/transactions',
      // budgets: '/api/v1/budgets',
      // categories: '/api/v1/categories',
      // reports: '/api/v1/reports'
    },
    status: 'Módulos em desenvolvimento - Apenas Auth disponível'
  });
});

// =====================================================
// 🔐 Módulos da Aplicação
// =====================================================

// Instanciar módulos
const authModule = new AuthModule();
// TODO: Descomentar quando os módulos forem implementados
// const transactionModule = new TransactionModule();
// const budgetModule = new BudgetModule();
// const categoryModule = new CategoryModule();
// const reportModule = new ReportModule();

// Aplicar rotas dos módulos com versionamento
const API_VERSION = '/api/v1';

app.use(`${API_VERSION}/auth`, authLimiter, authModule.getRouter());
// TODO: Descomentar quando os módulos forem implementados
// app.use(`${API_VERSION}/transactions`, authenticateToken, transactionModule.getRouter());
// app.use(`${API_VERSION}/budgets`, authenticateToken, budgetModule.getRouter());
// app.use(`${API_VERSION}/categories`, authenticateToken, categoryModule.getRouter());
// app.use(`${API_VERSION}/reports`, authenticateToken, reportModule.getRouter());

// =====================================================
// 🔒 Rotas Administrativas (Exemplo)
// =====================================================

app.get(`${API_VERSION}/admin/users`, 
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
      'POST /api/v1/auth/register',
      'POST /api/v1/auth/login',
      'GET /api/v1/auth/me',
      'POST /api/v1/auth/logout'
      // TODO: Adicionar quando outros módulos forem implementados
      // 'GET /api/v1/transactions',
      // 'POST /api/v1/transactions',
      // 'GET /api/v1/budgets',
      // 'POST /api/v1/budgets',
      // 'GET /api/v1/categories',
      // 'GET /api/v1/reports'
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
  logger.info(`   🔐 Auth: ${API_VERSION}/auth`);
  logger.info('   ⚠️  Outros módulos em desenvolvimento...');
  // TODO: Descomentar quando módulos forem implementados
  // logger.info(`   💰 Transactions: ${API_VERSION}/transactions`);
  // logger.info(`   📊 Budgets: ${API_VERSION}/budgets`);
  // logger.info(`   🏷️ Categories: ${API_VERSION}/categories`);
  // logger.info(`   📈 Reports: ${API_VERSION}/reports`);
  
  // Log de configurações de segurança
  logger.info('🛡️ Configurações de segurança ativas:');
  logger.info('   ✅ Helmet (CSP, HSTS, etc.)');
  logger.info('   ✅ Rate Limiting');
  logger.info('   ✅ CORS configurado');
  logger.info('   ✅ Headers de segurança adicionais');
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

process.on('unhandledRejection', (reason, _promise) => {
  logger.error('🚨 Unhandled Promise Rejection:', reason);
  // Em produção, você pode querer encerrar o processo
  // process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

export default app;
