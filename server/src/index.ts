import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de segurança e performance
app.use(helmet({
  contentSecurityPolicy: false, // Permitir para desenvolvimento
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors({
  origin: ['http://localhost:5174', 'http://127.0.0.1:5174'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '6.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// API endpoints básicos
app.get('/api/status', (req, res) => {
  res.json({
    message: 'Will Finance 6.0 API is running',
    version: '6.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mock endpoint para transações
app.get('/api/transactions', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        description: 'Salário',
        amount: 5000,
        type: 'INCOME',
        date: new Date().toISOString(),
        category: 'Trabalho'
      },
      {
        id: '2',
        description: 'Supermercado',
        amount: -250,
        type: 'EXPENSE',
        date: new Date().toISOString(),
        category: 'Alimentação'
      }
    ],
    total: 2
  });
});

// API Routes - Simple Express routes
app.get('/api/dashboard/stats', (req, res) => {
  const mockStats = {
    balance: 25847.90,
    totalIncome: 45000.00,
    totalExpenses: 19152.10,
    transactionCount: 142,
    monthlyGrowth: 12.5,
    categories: [
      { name: 'Alimentação', spent: 1250.00, budget: 1500.00 },
      { name: 'Transporte', spent: 450.00, budget: 600.00 },
      { name: 'Entretenimento', spent: 320.00, budget: 400.00 },
      { name: 'Saúde', spent: 180.00, budget: 300.00 }
    ]
  };
  res.json(mockStats);
});

app.get('/api/transactions', (req, res) => {
  const mockTransactions = [
    {
      id: '1',
      description: 'Salário Mensal',
      amount: 5000.00,
      type: 'income',
      category: 'Trabalho',
      date: new Date().toISOString(),
      tags: ['recorrente']
    },
    {
      id: '2',
      description: 'Supermercado Extra',
      amount: -250.00,
      type: 'expense',
      category: 'Alimentação',
      date: new Date(Date.now() - 86400000).toISOString(),
      tags: ['necessário']
    }
  ];
  res.json(mockTransactions);
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
    path: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Will Finance 6.0 API Server rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Status: http://localhost:${PORT}/api/status`);
});

export default app;
