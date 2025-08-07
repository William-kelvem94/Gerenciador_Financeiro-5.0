/**
 * 🔄 Transaction Controller - Will Finance 5.0
 * 
 * Controller responsável por gerenciar transações financeiras
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TransactionController {
  /**
   * Listar todas as transações
   */
  async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 50, type, search, userId } = req.query;
      
      // Para desenvolvimento, usar userId padrão se não fornecido
      const currentUserId = userId as string || 'dev-user-001';
      
      const skip = (Number(page) - 1) * Number(limit);
      
      const where: Record<string, unknown> = { userId: currentUserId };
      if (type && (type === 'INCOME' || type === 'EXPENSE')) {
        where.type = type;
      }
      if (search) {
        where.description = {
          contains: search as string,
          mode: 'insensitive',
        };
      }

      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where,
          orderBy: { date: 'desc' },
          skip,
          take: Number(limit),
          include: {
            category: true,
            account: true,
          },
        }),
        prisma.transaction.count({ where }),
      ]);

      res.json({
        success: true,
        data: transactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch transactions',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Criar nova transação
   */
  async createTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { description, amount, type, categoryId, accountId, date, userId } = req.body;

      // Para desenvolvimento, usar userId padrão se não fornecido
      const currentUserId = userId || 'dev-user-001';

      // Validation
      if (!description || !amount || !type || !date) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields',
          required: ['description', 'amount', 'type', 'date'],
        });
        return;
      }

      const transaction = await prisma.transaction.create({
        data: {
          description,
          amount: parseFloat(amount),
          type: type.toUpperCase(),
          date: new Date(date),
          userId: currentUserId,
          accountId: accountId || null,
          categoryId: categoryId || null,
          status: 'COMPLETED',
        },
        include: {
          category: true,
          account: true,
        },
      });

      res.status(201).json({
        success: true,
        data: transaction,
        message: 'Transaction created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create transaction',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Atualizar transação
   */
  async updateTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { description, amount, type, categoryId, accountId, date } = req.body;

      const transaction = await prisma.transaction.update({
        where: { id },
        data: {
          description,
          amount: parseFloat(amount),
          type: type.toUpperCase(),
          date: new Date(date),
          categoryId,
          accountId,
        },
        include: {
          category: true,
          account: true,
        },
      });

      res.json({
        success: true,
        data: transaction,
        message: 'Transaction updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update transaction',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Deletar transação
   */
  async deleteTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await prisma.transaction.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Transaction deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete transaction',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Obter estatísticas das transações
   */
  async getTransactionStats(req: Request, res: Response): Promise<void> {
    try {
      const [totalIncome, totalExpenses, transactionCount] = await Promise.all([
        prisma.transaction.aggregate({
          where: { type: 'INCOME' },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: { type: 'EXPENSE' },
          _sum: { amount: true },
        }),
        prisma.transaction.count(),
      ]);

      const income = totalIncome._sum.amount || 0;
      const expenses = totalExpenses._sum.amount || 0;
      const balance = income - expenses;

      res.json({
        success: true,
        data: {
          income,
          expenses,
          balance,
          transactionCount,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch transaction stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
