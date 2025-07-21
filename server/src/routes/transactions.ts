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

const updateTransactionSchema = z.object({
  accountId: z.string().optional(),
  categoryId: z.string().optional(),
  amount: z.number().optional(),
  description: z.string().optional(),
  type: z.enum(['income', 'expense', 'transfer']).optional(),
  date: z.string().optional(),
});

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