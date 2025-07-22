import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken } from './auth';

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticateToken);

// Validation schemas
const createTransactionSchema = z.object({
  accountId: z.string(),
  categoryId: z.string(),
  amount: z.number(),
  description: z.string(),
  type: z.enum(['income', 'expense', 'transfer']),
  date: z.string(),
});

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const createTransactionSchema = z.object({
  amount: z.number().positive('Valor deve ser positivo'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  type: z.enum(['income', 'expense', 'transfer'], {
    errorMap: () => ({ message: 'Tipo deve ser income, expense ou transfer' })
  }),
  date: z.string().datetime('Data inválida'),
  accountId: z.string().min(1, 'Conta é obrigatória'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
});

const updateTransactionSchema = createTransactionSchema.partial();

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/transactions - Lista todas as transações do usuário
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { page = 1, limit = 10, type, accountId, categoryId, startDate, endDate } = req.query;
    
    const where: any = {
      userId: req.user!.id,
    };

    // Filtros opcionais
    if (type) where.type = type;
    if (accountId) where.accountId = accountId;
    if (categoryId) where.categoryId = categoryId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          account: { select: { id: true, name: true, type: true } },
          category: { select: { id: true, name: true, icon: true, color: true } },
        },
        orderBy: { date: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar transações' 
    });
  }
});

// GET /api/transactions/:id - Busca uma transação específica
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        account: { select: { id: true, name: true, type: true } },
        category: { select: { id: true, name: true, icon: true, color: true } },
      },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada',
      });
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar transação' 
    });
  }
});

// POST /api/transactions - Cria nova transação
router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const validatedData = createTransactionSchema.parse(req.body);

    // Verificar se conta pertence ao usuário
    const account = await prisma.account.findFirst({
      where: {
        id: validatedData.accountId,
        userId: req.user!.id,
      },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Conta não encontrada',
      });
    }

    // Verificar se categoria existe
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada',
      });
    }

    // Criar transação e atualizar saldo da conta em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Criar transação
      const transaction = await tx.transaction.create({
        data: {
          ...validatedData,
          userId: req.user!.id,
          date: new Date(validatedData.date),
        },
        include: {
          account: { select: { id: true, name: true, type: true } },
          category: { select: { id: true, name: true, icon: true, color: true } },
        },
      });

      // Atualizar saldo da conta
      const balanceChange = validatedData.type === 'income' 
        ? validatedData.amount 
        : -validatedData.amount;

      await tx.account.update({
        where: { id: validatedData.accountId },
        data: { balance: { increment: balanceChange } },
      });

      return transaction;
    });

    res.status(201).json({
      success: true,
      data: result,
      message: 'Transação criada com sucesso',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors,
      });
    }

    console.error('Create transaction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao criar transação' 
    });
  }
});

// PUT /api/transactions/:id - Atualiza transação
router.put('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const validatedData = updateTransactionSchema.parse(req.body);

    // Buscar transação atual
    const currentTransaction = await prisma.transaction.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!currentTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada',
      });
    }

    // Validações adicionais se mudou conta ou categoria
    if (validatedData.accountId && validatedData.accountId !== currentTransaction.accountId) {
      const account = await prisma.account.findFirst({
        where: {
          id: validatedData.accountId,
          userId: req.user!.id,
        },
      });

      if (!account) {
        return res.status(404).json({
          success: false,
          message: 'Conta não encontrada',
        });
      }
    }

    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: validatedData.categoryId },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada',
        });
      }
    }

    // Atualizar transação e saldos em transação
    const result = await prisma.$transaction(async (tx) => {
      // Se mudou conta, valor ou tipo, precisa ajustar saldos
      const accountChanged = validatedData.accountId && validatedData.accountId !== currentTransaction.accountId;
      const amountChanged = validatedData.amount && validatedData.amount !== currentTransaction.amount;
      const typeChanged = validatedData.type && validatedData.type !== currentTransaction.type;

      if (accountChanged || amountChanged || typeChanged) {
        // Reverter efeito da transação anterior na conta original
        const oldBalanceChange = currentTransaction.type === 'income' 
          ? -currentTransaction.amount 
          : currentTransaction.amount;

        await tx.account.update({
          where: { id: currentTransaction.accountId },
          data: { balance: { increment: oldBalanceChange } },
        });

        // Aplicar efeito da nova transação na conta (nova ou mesma)
        const newAmount = validatedData.amount ?? currentTransaction.amount;
        const newType = validatedData.type ?? currentTransaction.type;
        const newAccountId = validatedData.accountId ?? currentTransaction.accountId;
        
        const newBalanceChange = newType === 'income' ? newAmount : -newAmount;

        await tx.account.update({
          where: { id: newAccountId },
          data: { balance: { increment: newBalanceChange } },
        });
      }

      // Atualizar transação
      const updatedData: any = { ...validatedData };
      if (updatedData.date) {
        updatedData.date = new Date(updatedData.date);
      }

      return await tx.transaction.update({
        where: { id: req.params.id },
        data: updatedData,
        include: {
          account: { select: { id: true, name: true, type: true } },
          category: { select: { id: true, name: true, icon: true, color: true } },
        },
      });
    });

    res.json({
      success: true,
      data: result,
      message: 'Transação atualizada com sucesso',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors,
      });
    }

    console.error('Update transaction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao atualizar transação' 
    });
  }
});

// DELETE /api/transactions/:id - Remove transação
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada',
      });
    }

    // Deletar transação e ajustar saldo em transação
    await prisma.$transaction(async (tx) => {
      // Reverter efeito no saldo da conta
      const balanceChange = transaction.type === 'income' 
        ? -transaction.amount 
        : transaction.amount;

      await tx.account.update({
        where: { id: transaction.accountId },
        data: { balance: { increment: balanceChange } },
      });

      // Deletar transação
      await tx.transaction.delete({
        where: { id: req.params.id },
      });
    });

    res.json({
      success: true,
      message: 'Transação removida com sucesso',
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao remover transação' 
    });
  }
});

// GET /api/transactions/stats/summary - Estatísticas de transações
router.get('/stats/summary', async (req: AuthenticatedRequest, res) => {
  try {
    const { startDate, endDate, accountId } = req.query;
    
    const where: any = {
      userId: req.user!.id,
    };

    if (accountId) where.accountId = accountId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const [income, expenses, totalTransactions] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, type: 'income' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: 'expense' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.transaction.count({ where }),
    ]);

    const totalIncome = income._sum.amount || 0;
    const totalExpenses = expenses._sum.amount || 0;
    const balance = totalIncome - totalExpenses;

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        balance,
        totalTransactions,
        incomeCount: income._count,
        expenseCount: expenses._count,
      },
    });
  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar estatísticas' 
    });
  }
});

export { router as transactionRoutes };

// Get all transactions
router.get('/', async (req: any, res) => {
  try {
    const { page = 1, limit = 10, type, accountId, categoryId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      userId: req.user.userId,
    };

    if (type) where.type = type;
    if (accountId) where.accountId = accountId;
    if (categoryId) where.categoryId = categoryId;

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        account: true,
        category: true,
      },
      orderBy: { date: 'desc' },
      skip,
      take: Number(limit),
    });

    const total = await prisma.transaction.count({ where });

    res.json({
      transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get transaction by ID
router.get('/:id', async (req: any, res) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
      include: {
        account: true,
        category: true,
      },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create transaction
router.post('/', async (req: any, res) => {
  try {
    const data = createTransactionSchema.parse(req.body);

    // Verify account belongs to user
    const account = await prisma.account.findFirst({
      where: {
        id: data.accountId,
        userId: req.user.userId,
      },
    });

    if (!account) {
      return res.status(400).json({ error: 'Invalid account' });
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        userId: req.user.userId,
        date: new Date(data.date),
      },
      include: {
        account: true,
        category: true,
      },
    });

    // Update account balance
    const balanceChange = data.type === 'income' ? data.amount : -data.amount;
    await prisma.account.update({
      where: { id: data.accountId },
      data: {
        balance: {
          increment: balanceChange,
        },
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update transaction
router.put('/:id', async (req: any, res) => {
  try {
    const data = updateTransactionSchema.parse(req.body);

    // Find existing transaction
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

    if (!existingTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Update transaction
    const transaction = await prisma.transaction.update({
      where: { id: req.params.id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
      include: {
        account: true,
        category: true,
      },
    });

    res.json(transaction);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Delete transaction
router.delete('/:id', async (req: any, res) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Update account balance (reverse the transaction)
    const balanceChange = transaction.type === 'income' ? -transaction.amount : transaction.amount;
    await prisma.account.update({
      where: { id: transaction.accountId },
      data: {
        balance: {
          increment: balanceChange,
        },
      },
    });

    // Delete transaction
    await prisma.transaction.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export { router as transactionRoutes };