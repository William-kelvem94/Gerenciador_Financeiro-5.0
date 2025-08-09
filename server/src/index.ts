import express from 'express';
import cors from 'cors';
import transactionRoutes from './modules/transactions/routes/transaction.routes';
import reportRoutes from './modules/reports/routes/report.routes';

const app = express();
app.use(cors());
app.use(express.json());
// Rotas principais dos módulos
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);
// Rota global de status
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API online', date: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '5.0.0' });
});

// TODO: Adicionar rotas de autenticação, orçamentos, dashboard, etc.

const PORT = 5174;
app.listen(PORT, () => {
  console.log(`Will Finance 5.0 API rodando na porta ${PORT}`);
});
