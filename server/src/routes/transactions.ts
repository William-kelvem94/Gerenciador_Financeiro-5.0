import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@/config/database';
import { authenticateToken } from '@/middleware/auth';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import { validateRequest } from '@/middleware/validation';
import { logger } from '@/utils/logger';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Validation schemas
const createTransactionSchema = z.object({
  body: z.object({
    accountId: z.string().uuid('Invalid account ID'),
    categoryId: z.string().uuid('Invalid category ID'),
    amount: z.number().positive('Amount must be positive'),
    description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
    type: z.enum(['income', 'expense', 'transfer'], {
      errorMap: () => ({ message: 'Type must be income, expense, or transfer' })
    }),
    date: z.string().datetime('Invalid date format'),
    tags: z.array(z.string()).optional(),
    location: z.string().optional(),
    receipt: z.string().url().optional(),
  })
});

const updateTransactionSchema = z.object({
  body: z.object({
    accountId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    amount: z.number().positive().optional(),
    description: z.string().min(1).max(500).optional(),
    type: z.enum(['income', 'expense', 'transfer']).optional(),
    date: z.string().datetime().optional(),
    tags: z.array(z.string()).optional(),
    location: z.string().optional(),
    receipt: z.string().url().optional(),
  })
});

const queryTransactionsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
    accountId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    type: z.enum(['income', 'expense', 'transfer']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    search: z.string().optional(),
    sortBy: z.enum(['date', 'amount', 'description']).default('date'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
});

// Get transactions with pagination and filters
router.get('/', validateRequest(queryTransactionsSchema), asyncHandler(async (req: any, res: any) => {
  const userId = req.user.userId;
  const {
    page,
    limit,
    accountId,
    categoryId,
    type,
    startDate,
    endDate,
    search,
    sortBy,
    sortOrder
  } = req.query;

  // Build where clause
  const where: any = {
    userId,
    ...(accountId && { accountId }),
    ...(categoryId && { categoryId }),
    ...(type && { type }),
    ...(startDate && endDate && {
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }),
    ...(search && {
      description: {
        contains: search,
        mode: 'insensitive'
      }
    })
  };

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get transactions
  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        account: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    }),
    prisma.transaction.count({ where })
  ]);

  const totalPages = Math.ceil(total / limit);

  logger.info(`Retrieved ${transactions.length} transactions for user: ${req.user.username}`);

  res.json({
    status: 'success',
    data: {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  });
}));

// Get transaction by ID
router.get('/:id', asyncHandler(async (req: any, res: any) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      userId
    },
    include: {
      account: true,
      category: true
    }
  });

  if (!transaction) {
    throw createError('Transaction not found', 404);
  }

  res.json({
    status: 'success',
    data: { transaction }
  });
}));

// Create new transaction
router.post('/', validateRequest(createTransactionSchema), asyncHandler(async (req: any, res: any) => {
  const userId = req.user.userId;
  const {
    accountId,
    categoryId,
    amount,
    description,
    type,
    date,
    tags,
    location
  } = req.body;

  // Verify account belongs to user
  const account = await prisma.account.findFirst({
    where: {
      id: accountId,
      userId,
      isActive: true
    }
  });

  if (!account) {
    throw createError('Account not found or inactive', 400);
  }

  // Verify category belongs to user and matches transaction type
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
      type,
      isActive: true
    }
  });

  if (!category) {
    throw createError('Category not found, inactive, or type mismatch', 400);
  }

  // Create transaction in a database transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create the transaction
    const transaction = await tx.transaction.create({
      data: {
        userId,
        accountId,
        categoryId,
        amount,
        description,
        type,
        date: new Date(date),
        location,
        notes: tags ? JSON.stringify(tags) : null
      },
      include: {
        account: true,
        category: true
      }
    });

    // Update account balance
    const balanceChange = type === 'income' ? amount : -amount;
    
    await tx.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: balanceChange
        }
      }
    });

    return transaction;
  });

  logger.info(`Transaction created: ${result.id} by user: ${req.user.username}`);

  res.status(201).json({
    status: 'success',
    message: 'Transaction created successfully',
    data: { transaction: result }
  });
}));

// Update transaction
router.put('/:id', validateRequest(updateTransactionSchema), asyncHandler(async (req: any, res: any) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const updateData = req.body;

  // Get current transaction
  const currentTransaction = await prisma.transaction.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!currentTransaction) {
    throw createError('Transaction not found', 404);
  }

  // Validate new account if provided
  if (updateData.accountId && updateData.accountId !== currentTransaction.accountId) {
    const account = await prisma.account.findFirst({
      where: {
        id: updateData.accountId,
        userId,
        isActive: true
      }
    });

    if (!account) {
      throw createError('Account not found or inactive', 400);
    }
  }

  // Validate new category if provided
  if (updateData.categoryId && updateData.categoryId !== currentTransaction.categoryId) {
    const type = updateData.type ?? currentTransaction.type;
    
    const category = await prisma.category.findFirst({
      where: {
        id: updateData.categoryId,
        userId,
        type,
        isActive: true
      }
    });

    if (!category) {
      throw createError('Category not found, inactive, or type mismatch', 400);
    }
  }

  // Update transaction
  const updatedTransaction = await prisma.transaction.update({
    where: { id },
    data: {
      ...updateData,
      ...(updateData.date && { date: new Date(updateData.date) }),
      ...(updateData.tags && { tags: JSON.stringify(updateData.tags) })
    },
    include: {
      account: true,
      category: true
    }
  });

  logger.info(`Transaction updated: ${id} by user: ${req.user.username}`);

  res.json({
    status: 'success',
    message: 'Transaction updated successfully',
    data: { transaction: updatedTransaction }
  });
}));

// Delete transaction
router.delete('/:id', asyncHandler(async (req: any, res: any) => {
  const userId = req.user.userId;
  const { id } = req.params;

  // Get transaction to verify ownership and get details for balance reversion
  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!transaction) {
    throw createError('Transaction not found', 404);
  }

  // Delete transaction and revert balance changes
  await prisma.$transaction(async (tx) => {
    // Delete the transaction
    await tx.transaction.delete({
      where: { id }
    });

    // Revert account balance
    const balanceChange = transaction.type === 'income' ? -transaction.amount : transaction.amount;
    
    await tx.account.update({
      where: { id: transaction.accountId },
      data: {
        balance: {
          increment: balanceChange
        }
      }
    });
  });

  logger.info(`Transaction deleted: ${id} by user: ${req.user.username}`);

  res.json({
    status: 'success',
    message: 'Transaction deleted successfully'
  });
}));

// Get transaction statistics
router.get('/stats/summary', asyncHandler(async (req: any, res: any) => {
  const userId = req.user.userId;
  const { startDate, endDate } = req.query;

  const dateFilter = startDate && endDate ? {
    date: {
      gte: new Date(startDate),
      lte: new Date(endDate)
    }
  } : {};

  const [income, expenses, totalTransactions] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        userId,
        type: 'income',
        ...dateFilter
      },
      _sum: {
        amount: true
      }
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        type: 'expense',
        ...dateFilter
      },
      _sum: {
        amount: true
      }
    }),
    prisma.transaction.count({
      where: {
        userId,
        ...dateFilter
      }
    })
  ]);

  const totalIncome = income._sum.amount ?? 0;
  const totalExpenses = expenses._sum.amount ?? 0;
  const netIncome = totalIncome - totalExpenses;

  res.json({
    status: 'success',
    data: {
      totalIncome,
      totalExpenses,
      netIncome,
      totalTransactions,
      period: startDate && endDate ? { startDate, endDate } : 'all-time'
    }
  });
}));

export default router;
