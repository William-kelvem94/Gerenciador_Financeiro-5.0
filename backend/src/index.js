import express from 'express';
import dotenv from 'dotenv';
import db from './models/index.js';
import morgan from 'morgan';

import userRoutes from './routes/user.js';
import cardRoutes from './routes/card.js';
import recurringRoutes from './routes/recurring.js';
import budgetRoutes from './routes/budget.js';
import reconciliationRoutes from './routes/reconciliation.js';
import investmentRoutes from './routes/investment.js';
import assetRoutes from './routes/asset.js';
import debtRoutes from './routes/debt.js';
import goalRoutes from './routes/goal.js';
import reportRoutes from './routes/report.js';
import importRoutes from './routes/import.js';
import settingsRoutes from './routes/settings.js';
import attachmentRoutes from './routes/attachment.js';
import currencyRoutes from './routes/currency.js';
import integrationRoutes from './routes/integration.js';
import importExportRoutes from './routes/importexport.js';
import notificationRoutes from './routes/notification.js';
import auditlogRoutes from './routes/auditlog.js';
import { auditLog } from './middleware/audit.js';
import { authMiddleware, authorize } from './middleware/auth.js';
import backupRoutes from './routes/backup.js';
import paymentRoutes from './routes/payment.js';
import ocrRoutes from './routes/ocr.js';
import aiRoutes from './routes/ai.js';
import webhookRoutes from './routes/webhook.js';
import customReportRoutes from './routes/customreport.js';
import blockRuleRoutes from './routes/blockrule.js';
import contractRoutes from './routes/contract.js';
import calendarRoutes from './routes/calendar.js';
import taxRoutes from './routes/tax.js';
import taxProfileRoutes from './routes/taxprofile.js';
import smartReconciliationRoutes from './routes/smartreconciliation.js';
import { setupRealtime } from './routes/realtime.js';
import cashbackRoutes from './routes/cashback.js';
import insuranceRoutes from './routes/insurance.js';
import inheritanceRoutes from './routes/inheritance.js';
import brokerIntegrationRoutes from './routes/brokerintegration.js';
import sharedExpenseRoutes from './routes/sharedexpense.js';
import simulationRoutes from './routes/simulation.js';
import subscriptionRoutes from './routes/subscription.js';
import erpRoutes from './routes/erp.js';
import approvalRoutes from './routes/approval.js';
import creditLimitRoutes from './routes/creditlimit.js';
import transactionRoutes from './routes/transaction.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Middleware de mock de autenticação para desenvolvimento
// Remova ou comente esta parte para usar JWT real
// app.use((req, res, next) => {
//   req.user = { id: 1, name: 'Mock User', role: 'admin' };
//   next();
// });

app.use('/api/users', userRoutes);
app.use('/api/cards', authMiddleware, cardRoutes);
app.use('/api/recurrings', authMiddleware, recurringRoutes);
app.use('/api/budgets', authMiddleware, budgetRoutes);
app.use('/api/reconciliation', authMiddleware, reconciliationRoutes);
app.use('/api/investments', authMiddleware, investmentRoutes);
app.use('/api/assets', authMiddleware, assetRoutes);
app.use('/api/debts', authMiddleware, debtRoutes);
app.use('/api/goals', authMiddleware, goalRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);
app.use('/api/import', authMiddleware, importRoutes);
app.use('/api/settings', authMiddleware, settingsRoutes);
app.use('/api/attachments', authMiddleware, attachmentRoutes);
app.use('/api/currencies', authMiddleware, currencyRoutes);
app.use('/api/integrations', authMiddleware, integrationRoutes);
app.use('/api/importexport', authMiddleware, importExportRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/auditlog', authMiddleware, auditlogRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);
app.use('/api/ocr', authMiddleware, ocrRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/webhooks', authMiddleware, webhookRoutes);
app.use('/api/customreports', authMiddleware, customReportRoutes);
app.use('/api/blockrules', authMiddleware, blockRuleRoutes);
app.use('/api/contracts', authMiddleware, contractRoutes);
app.use('/api/calendar', authMiddleware, calendarRoutes);
app.use('/api/tax', authMiddleware, taxRoutes);
app.use('/api/taxprofiles', authMiddleware, taxProfileRoutes);
app.use('/api/smartreconciliation', authMiddleware, smartReconciliationRoutes);
app.use('/api/cashbacks', authMiddleware, cashbackRoutes);
app.use('/api/insurances', authMiddleware, insuranceRoutes);
app.use('/api/inheritances', authMiddleware, inheritanceRoutes);
app.use('/api/brokerintegration', authMiddleware, brokerIntegrationRoutes);
app.use('/api/sharedexpenses', authMiddleware, sharedExpenseRoutes);
app.use('/api/simulation', authMiddleware, simulationRoutes);
app.use('/api/subscriptions', authMiddleware, subscriptionRoutes);
app.use('/api/erp', authMiddleware, erpRoutes);
app.use('/api/approvals', authMiddleware, approvalRoutes);
app.use('/api/creditlimits', authMiddleware, creditLimitRoutes);

// Exemplo: aplicar middleware de auditoria em rotas sensíveis
app.use('/api/transactions', authMiddleware, auditLog, transactionRoutes);
// Repita para outras rotas sensíveis conforme necessário

// Exemplo: proteger rotas de backup apenas para admin
app.use('/api/backup', authMiddleware, authorize('admin'), backupRoutes);

const PORT = 3001;

db.sequelize.sync().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Backend rodando na porta ${PORT}`);
  });
  setupRealtime(server);
});
