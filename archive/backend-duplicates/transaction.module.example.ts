/**
 * 🔄 Transaction Module - Will Finance 5.0
 * 
 * Template para implementação do módulo de transações
 * Renomeie para transaction.module.ts quando implementar
 */

import { Router } from 'express';
import { TransactionController } from './controllers/transaction.controller';
// TODO: Implementar TransactionController em ./controllers/transaction.controller.ts
import { validationMiddleware } from '../../shared/middleware/validation.middleware';
import { CreateTransactionSchema, UpdateTransactionSchema } from './dtos/transaction.dtos';

export class TransactionModule {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.router = Router();
    this.transactionController = new TransactionController();
    this.initRoutes();
  }

  private initRoutes(): void {
    // GET /api/v1/transactions - Listar transações
    this.router.get('/', this.transactionController.getTransactions.bind(this.transactionController));

    // GET /api/v1/transactions/:id - Buscar transação por ID
    this.router.get('/:id', this.transactionController.getTransactionById.bind(this.transactionController));

    // POST /api/v1/transactions - Criar nova transação
    this.router.post('/', 
      validationMiddleware(CreateTransactionSchema),
      this.transactionController.createTransaction.bind(this.transactionController)
    );

    // PUT /api/v1/transactions/:id - Atualizar transação
    this.router.put('/:id',
      validationMiddleware(UpdateTransactionSchema),
      this.transactionController.updateTransaction.bind(this.transactionController)
    );

    // DELETE /api/v1/transactions/:id - Deletar transação
    this.router.delete('/:id', this.transactionController.deleteTransaction.bind(this.transactionController));

    // GET /api/v1/transactions/stats/summary - Estatísticas
    this.router.get('/stats/summary', this.transactionController.getTransactionStats.bind(this.transactionController));
  }

  public getRouter(): Router {
    return this.router;
  }
}
