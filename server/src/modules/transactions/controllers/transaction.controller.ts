/**
 * 🔄 Transaction Controller - Will Finance 5.0
 * 
 * Controller responsável por gerenciar transações financeiras
 */

import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto, UpdateTransactionDto } from '../dtos/transaction.dtos';
import '../../../types/express'; // Importar extensões de tipos

// Logger simples (pode ser substituído por winston ou outro logger)
const logger = {
  error: (message: string, error?: unknown) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, error);
  },
};

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  /**
   * Listar todas as transações do usuário
   */
  async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { page = 1, limit = 10, type, categoryId, accountId, startDate, endDate } = req.query;

      if (!userId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const filters = {
        page: Number(page),
        limit: Number(limit),
        type: type as 'INCOME' | 'EXPENSE' | undefined,
        categoryId: categoryId as string,
        accountId: accountId as string,
        startDate: startDate as string,
        endDate: endDate as string,
      };

      const result = await this.transactionService.getTransactions(userId, filters);
      res.json(result);
    } catch (error) {
      logger.error('Erro ao buscar transações:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * Buscar transação por ID
   */
  async getTransactionById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const transaction = await this.transactionService.getTransactionById(id, userId);
      
      if (!transaction) {
        res.status(404).json({ error: 'Transação não encontrada' });
        return;
      }

      res.json(transaction);
    } catch (error) {
      logger.error('Erro ao buscar transação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * Criar nova transação
   */
  async createTransaction(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const transactionData: CreateTransactionDto = req.body;

      if (!userId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const transaction = await this.transactionService.createTransaction({
        ...transactionData,
        userId,
      });

      res.status(201).json(transaction);
    } catch (error) {
      logger.error('Erro ao criar transação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * Atualizar transação existente
   */
  async updateTransaction(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const updateData: UpdateTransactionDto = req.body;

      if (!userId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const transaction = await this.transactionService.updateTransaction(id, updateData, userId);
      
      if (!transaction) {
        res.status(404).json({ error: 'Transação não encontrada' });
        return;
      }

      res.json(transaction);
    } catch (error) {
      logger.error('Erro ao atualizar transação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * Deletar transação
   */
  async deleteTransaction(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const deleted = await this.transactionService.deleteTransaction(id, userId);
      
      if (!deleted) {
        res.status(404).json({ error: 'Transação não encontrada' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      logger.error('Erro ao deletar transação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * Obter estatísticas das transações
   */
  async getTransactionStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { startDate, endDate } = req.query;

      if (!userId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const stats = await this.transactionService.getTransactionStats(userId, {
        startDate: startDate as string,
        endDate: endDate as string,
      });

      res.json(stats);
    } catch (error) {
      logger.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
