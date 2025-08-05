import { Response } from 'express';
import { prisma } from '../../../db/client';
import { AuthenticatedRequest } from '../../../types/auth';
import { logger } from '../../../utils/logger';

export class TransactionController {
  
  /**
   * GET /api/transactions/simple - Lista transações do usuário com formato simplificado
   */
  async getSimpleTransactions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Buscar transações do usuário com informações de conta e categoria
      const transactions = await prisma.transaction.findMany({
        where: {
          userId: userId
        },
        include: {
          account: {
            select: {
              id: true,
              name: true,
              type: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
              color: true,
              type: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      });

      // Adaptar para o formato esperado pelo frontend
      const adaptedTransactions = transactions.map(transaction => ({
        id: transaction.id,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category.name,
        date: transaction.date.toISOString().split('T')[0],
        status: transaction.status.toLowerCase() === 'completed' ? 'completed' : 
                transaction.status.toLowerCase() === 'pending' ? 'pending' : 'cancelled'
      }));

      res.json(adaptedTransactions);
    } catch (error) {
      logger.error('Error fetching transactions:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: 'Failed to fetch transactions'
      });
    }
  }

  /**
   * POST /api/transactions/simple - Criar transação com conta padrão
   */
  async createSimpleTransaction(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const { description, amount, type, category, date, status = 'completed' } = req.body;

      // Validações básicas
      if (!description || !amount || !type || !category || !date) {
        res.status(400).json({ 
          error: 'Missing required fields',
          details: 'description, amount, type, category, and date are required'
        });
        return;
      }

      if (amount <= 0) {
        res.status(400).json({
          error: 'Invalid amount',
          details: 'Amount must be greater than 0'
        });
        return;
      }

      if (!['income', 'expense'].includes(type)) {
        res.status(400).json({
          error: 'Invalid type',
          details: 'Type must be income or expense'
        });
        return;
      }

      // Buscar ou criar conta padrão para o usuário
      let defaultAccount = await prisma.account.findFirst({
        where: {
          userId: userId,
          name: 'Conta Principal'
        }
      });

      if (!defaultAccount) {
        defaultAccount = await prisma.account.create({
          data: {
            name: 'Conta Principal',
            type: 'checking',
            balance: 0,
            currency: 'BRL',
            userId: userId,
            icon: 'wallet',
            color: '#3B82F6'
          }
        });
      }

      // Buscar ou criar categoria
      let transactionCategory = await prisma.category.findFirst({
        where: {
          name: category,
          OR: [
            { userId: userId },
            { isSystem: true, userId: null }
          ]
        }
      });

      if (!transactionCategory) {
        // Criar categoria personalizada para o usuário
        transactionCategory = await prisma.category.create({
          data: {
            name: category,
            type: type,
            userId: userId,
            icon: 'tag',
            color: type === 'income' ? '#10B981' : '#EF4444'
          }
        });
      }

      // Criar transação usando transação do Prisma para atomicidade
      const result = await prisma.$transaction(async (tx) => {
        // Criar a transação
        const transaction = await tx.transaction.create({
          data: {
            description,
            amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
            type,
            date: new Date(date),
            status: status.toUpperCase(),
            userId: userId,
            accountId: defaultAccount!.id,
            categoryId: transactionCategory!.id
          },
          include: {
            account: {
              select: {
                id: true,
                name: true,
                type: true
              }
            },
            category: {
              select: {
                id: true,
                name: true,
                icon: true,
                color: true,
                type: true
              }
            }
          }
        });

        // Atualizar saldo da conta
        const balanceChange = type === 'income' ? Math.abs(amount) : -Math.abs(amount);
        await tx.account.update({
          where: { id: defaultAccount!.id },
          data: {
            balance: {
              increment: balanceChange
            }
          }
        });

        return transaction;
      });

      // Adaptar resposta para o formato esperado pelo frontend
      const adaptedTransaction = {
        id: result.id,
        description: result.description,
        amount: Math.abs(result.amount),
        type: result.type,
        category: result.category.name,
        date: result.date.toISOString().split('T')[0],
        status: result.status.toLowerCase() === 'completed' ? 'completed' : 
                result.status.toLowerCase() === 'pending' ? 'pending' : 'cancelled'
      };

      res.status(201).json(adaptedTransaction);
    } catch (error) {
      logger.error('Error creating transaction:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: 'Failed to create transaction'
      });
    }
  }

  /**
   * PUT /api/transactions/simple/:id - Atualizar transação
   */
  async updateSimpleTransaction(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const transactionId = req.params.id;
      
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const { description, amount, type, category, date, status } = req.body;

      // Verificar se a transação existe e pertence ao usuário
      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          id: transactionId,
          userId: userId
        },
        include: {
          account: true,
          category: true
        }
      });

      if (!existingTransaction) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }

      // Buscar categoria se foi alterada
      let transactionCategory = existingTransaction.category;
      if (category && category !== existingTransaction.category.name) {
        const foundCategory = await prisma.category.findFirst({
          where: {
            name: category,
            OR: [
              { userId: userId },
              { isSystem: true, userId: null }
            ]
          }
        });

        if (foundCategory) {
          transactionCategory = foundCategory;
        } else {
          // Criar nova categoria se não existir
          transactionCategory = await prisma.category.create({
            data: {
              name: category,
              type: type || existingTransaction.type,
              userId: userId,
              icon: 'tag',
              color: (type || existingTransaction.type) === 'income' ? '#10B981' : '#EF4444'
            }
          });
        }
      }

      // Atualizar usando transação do Prisma
      const result = await prisma.$transaction(async (tx) => {
        // Calcular diferença no saldo se o valor ou tipo mudou
        const oldAmount = existingTransaction.type === 'income' ? 
          Math.abs(existingTransaction.amount) : -Math.abs(existingTransaction.amount);
        
        const newAmount = (type || existingTransaction.type) === 'income' ? 
          Math.abs(amount || Math.abs(existingTransaction.amount)) : 
          -Math.abs(amount || Math.abs(existingTransaction.amount));

        const balanceDifference = newAmount - oldAmount;

        // Atualizar transação
        const updatedTransaction = await tx.transaction.update({
          where: { id: transactionId },
          data: {
            description: description || existingTransaction.description,
            amount: newAmount,
            type: type || existingTransaction.type,
            date: date ? new Date(date) : existingTransaction.date,
            status: status ? status.toUpperCase() : existingTransaction.status,
            categoryId: transactionCategory.id
          },
          include: {
            account: {
              select: {
                id: true,
                name: true,
                type: true
              }
            },
            category: {
              select: {
                id: true,
                name: true,
                icon: true,
                color: true,
                type: true
              }
            }
          }
        });

        // Atualizar saldo da conta se necessário
        if (balanceDifference !== 0) {
          await tx.account.update({
            where: { id: existingTransaction.accountId },
            data: {
              balance: {
                increment: balanceDifference
              }
            }
          });
        }

        return updatedTransaction;
      });

      // Adaptar resposta
      const adaptedTransaction = {
        id: result.id,
        description: result.description,
        amount: Math.abs(result.amount),
        type: result.type,
        category: result.category.name,
        date: result.date.toISOString().split('T')[0],
        status: result.status.toLowerCase() === 'completed' ? 'completed' : 
                result.status.toLowerCase() === 'pending' ? 'pending' : 'cancelled'
      };

      res.json(adaptedTransaction);
    } catch (error) {
      logger.error('Error updating transaction:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: 'Failed to update transaction'
      });
    }
  }

  /**
   * DELETE /api/transactions/simple/:id - Deletar transação
   */
  async deleteSimpleTransaction(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const transactionId = req.params.id;
      
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Verificar se a transação existe e pertence ao usuário
      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          id: transactionId,
          userId: userId
        }
      });

      if (!existingTransaction) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }

      // Deletar usando transação do Prisma
      await prisma.$transaction(async (tx) => {
        // Reverter o impacto no saldo da conta
        const balanceReversion = existingTransaction.type === 'income' ? 
          -Math.abs(existingTransaction.amount) : Math.abs(existingTransaction.amount);

        await tx.account.update({
          where: { id: existingTransaction.accountId },
          data: {
            balance: {
              increment: balanceReversion
            }
          }
        });

        // Deletar transação
        await tx.transaction.delete({
          where: { id: transactionId }
        });
      });

      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting transaction:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: 'Failed to delete transaction'
      });
    }
  }
}

export const transactionController = new TransactionController();
