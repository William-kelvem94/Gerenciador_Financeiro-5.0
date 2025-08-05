import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authenticateToken } from '../../../shared/middleware/authenticateToken';

const router = Router();

// Instanciar o controller
const transactionController = new TransactionController();

// Todas as rotas precisam de autenticação
router.use(authenticateToken);

// GET /api/transactions/simple - Lista transações simplificadas
router.get('/simple', transactionController.getTransactions.bind(transactionController));

// POST /api/transactions/simple - Criar transação simplificada
router.post('/simple', transactionController.createTransaction.bind(transactionController));

// PUT /api/transactions/simple/:id - Atualizar transação
router.put('/simple/:id', transactionController.updateTransaction.bind(transactionController));

// DELETE /api/transactions/simple/:id - Deletar transação
router.delete('/simple/:id', transactionController.deleteTransaction.bind(transactionController));

export { router as transactionSimpleRoutes };
