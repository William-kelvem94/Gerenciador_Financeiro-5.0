/**
 * 🔄 Transaction Simple Routes - Will Finance 5.0
 * 
 * Rotas simplificadas para gerenciamento de transações
 */

import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
// import { authenticateToken } from '../../../shared/middleware/authenticateToken';

const router = Router();

// Instanciar o controller
const transactionController = new TransactionController();

// TODO: Reativar autenticação após organização
// router.use(authenticateToken);

// GET /api/transactions - Lista transações
router.get('/', transactionController.getTransactions.bind(transactionController));

// POST /api/transactions - Criar transação
router.post('/', transactionController.createTransaction.bind(transactionController));

// PUT /api/transactions/:id - Atualizar transação
router.put('/:id', transactionController.updateTransaction.bind(transactionController));

// DELETE /api/transactions/:id - Deletar transação
router.delete('/:id', transactionController.deleteTransaction.bind(transactionController));

// Rotas simplificadas para compatibilidade
router.get('/simple', transactionController.getTransactions.bind(transactionController));
router.post('/simple', transactionController.createTransaction.bind(transactionController));
router.put('/simple/:id', transactionController.updateTransaction.bind(transactionController));
router.delete('/simple/:id', transactionController.deleteTransaction.bind(transactionController));

export default router;
