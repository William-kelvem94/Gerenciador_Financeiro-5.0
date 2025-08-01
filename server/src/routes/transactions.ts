import express from 'express';
import { z } from 'zod';
import { prisma } from '../db/client';
import { authenticateToken } from './auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Validation schemas with proper UUID validation
const createTransactionSchema = z.object({
  accountId: z.string().uuid('Invalid account ID format'),
  categoryId: z.string().uuid('Invalid category ID format'),
  amount: z.number().refine((value) => {
    return Math.abs(value) > 0;
  }, { message: 'Amount must be greater than 0' }),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['income', 'expense', 'transfer']),
  date: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: 'Invalid date format',
  }),
});

const updateTransactionSchema = z.object({
  accountId: z.string().uuid('Invalid account ID format').optional(),
  categoryId: z.string().uuid('Invalid category ID format').optional(),
  amount: z.number().positive('Amount must be positive').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  type: z.enum(['income', 'expense', 'transfer']).optional(),
  date: z.string().datetime('Invalid date format').optional(),
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

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          account: {
            select: {
              id: true,
              name: true,
              type: true,
              currency: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
              color: true,
              type: true,
            },
          },
        },
        orderBy: { date: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.transaction.count({ where }),
    ]);

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
    res.status(500).json({ 
      error: 'Internal server error',
      details: 'Failed to retrieve transactions'
    });
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

// Create transaction with atomic balance update
router.post('/', async (req: any, res) => {
  try {
    const data = createTransactionSchema.parse(req.body);

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Verify account belongs to user
      const account = await tx.account.findFirst({
        where: {
          id: data.accountId,
          userId: req.user.userId,
        },
      });

      if (!account) {
        throw new Error('Account not found or access denied');
      }

      // Verify category exists
      const category = await tx.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new Error('Category not found');
      }

      // Create transaction
      const transaction = await tx.transaction.create({
        data: {
          description: data.description,
          amount: data.amount,
          type: data.type,
          categoryId: data.categoryId,
          accountId: data.accountId,
          userId: req.user.userId as string,
          date: new Date(data.date),
        },
        include: {
          account: {
            select: {
              id: true,
              name: true,
              type: true,
              currency: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
              color: true,
              type: true,
            },
          },
        },
      });

      // Update account balance atomically
      const balanceChange = data.type === 'income' ? data.amount : -data.amount;
      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      });

      return transaction;
    });

    res.status(201).json({
      ...result,
      message: 'Transaction created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.issues 
      });
    }
    
    console.error('Create transaction error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null,
    });
    
    if (error instanceof Error) {
      if (error.message.includes('Account not found')) {
        return res.status(404).json({ 
          error: 'Account not found',
          details: 'The specified account does not exist or you do not have access to it'
        });
      }
      if (error.message.includes('Category not found')) {
        return res.status(404).json({ 
          error: 'Category not found',
          details: 'The specified category does not exist'
        });
      }
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: 'Failed to create transaction'
    });
  }
});

// Update transaction with atomic balance correction
router.put('/:id', async (req: any, res) => {
  try {
    const data = updateTransactionSchema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      // Find existing transaction
      const existingTransaction = await tx.transaction.findFirst({
        where: {
          id: req.params.id,
          userId: req.user.userId,
        },
      });

      if (!existingTransaction) {
        throw new Error('Transaction not found');
      }

      // If account is being changed, verify new account belongs to user
      if (data.accountId && data.accountId !== existingTransaction.accountId) {
        const newAccount = await tx.account.findFirst({
          where: {
            id: data.accountId,
            userId: req.user.userId,
          },
        });

        if (!newAccount) {
          throw new Error('New account not found or access denied');
        }
      }

      // If category is being changed, verify it exists
      if (data.categoryId && data.categoryId !== existingTransaction.categoryId) {
        const category = await tx.category.findUnique({
          where: { id: data.categoryId },
        });

        if (!category) {
          throw new Error('Category not found');
        }
      }

      // Utility function to calculate balance changes
      function calculateBalanceChange(type: string, amount: number): number {
        return type === 'income' ? amount : -amount;
      }

      const oldBalanceChange = calculateBalanceChange(existingTransaction.type, existingTransaction.amount);
      const newAmount = data.amount ?? existingTransaction.amount;
      const newType = data.type ?? existingTransaction.type;
      const newAccountId = data.accountId ?? existingTransaction.accountId;
      const newBalanceChange = calculateBalanceChange(newType, newAmount);

      // Reverse old balance change from old account
      await tx.account.update({
        where: { id: existingTransaction.accountId },
        data: {
          balance: {
            increment: -oldBalanceChange,
          },
        },
      });

      // Apply new balance change to new account
      await tx.account.update({
        where: { id: newAccountId },
        data: {
          balance: {
            increment: newBalanceChange,
          },
        },
      });

      // Update transaction
      const transaction = await tx.transaction.update({
        where: { id: req.params.id },
        data: {
          ...data,
          date: data.date ? new Date(data.date) : undefined,
        },
        include: {
          account: {
            select: {
              id: true,
              name: true,
              type: true,
              currency: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
              color: true,
              type: true,
            },
          },
        },
      });

      return transaction;
    });

    res.json({
      ...result,
      message: 'Transaction updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.issues 
      });
    }

    console.error('Update transaction error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Transaction not found')) {
        return res.status(404).json({ 
          error: 'Transaction not found',
          details: 'The specified transaction does not exist or you do not have access to it'
        });
      }
      if (error.message.includes('account not found')) {
        return res.status(404).json({ 
          error: 'Account not found',
          details: 'The specified account does not exist or you do not have access to it'
        });
      }
      if (error.message.includes('Category not found')) {
        return res.status(404).json({ 
          error: 'Category not found',
          details: 'The specified category does not exist'
        });
      }
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: 'Failed to update transaction'
    });
  }
});

// Delete transaction with atomic balance correction
router.delete('/:id', async (req: any, res) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findFirst({
        where: {
          id: req.params.id,
          userId: req.user.userId,
        },
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Update account balance (reverse the transaction)
      const balanceChange = transaction.type === 'income' ? -transaction.amount : transaction.amount;
      await tx.account.update({
        where: { id: transaction.accountId },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      });

      // Delete transaction
      await tx.transaction.delete({
        where: { id: req.params.id },
      });

      return transaction;
    });

    res.json({ 
      message: 'Transaction deleted successfully',
      deletedTransaction: {
        id: result.id,
        amount: result.amount,
        type: result.type,
      },
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    
    if (error instanceof Error && error.message.includes('Transaction not found')) {
      return res.status(404).json({ 
        error: 'Transaction not found',
        details: 'The specified transaction does not exist or you do not have access to it'
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: 'Failed to delete transaction'
    });
  }
});

export { router as transactionRoutes };