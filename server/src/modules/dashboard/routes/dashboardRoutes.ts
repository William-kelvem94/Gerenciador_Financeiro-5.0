import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController-clean';
import { authenticateToken } from '../../../shared/middleware/authenticateToken';

const router = Router();
const dashboardController = new DashboardController();

// Todas as rotas do dashboard requerem autenticação
router.use(authenticateToken);

// GET /api/dashboard/stats - Estatísticas do usuário
router.get('/stats', dashboardController.getDashboardStats.bind(dashboardController));

// GET /api/dashboard/recent-transactions - Transações recentes do usuário
router.get('/recent-transactions', dashboardController.getRecentTransactions.bind(dashboardController));

export { router as dashboardRoutes };
