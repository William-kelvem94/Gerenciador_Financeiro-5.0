import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@/config/database';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import { validateRequest } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';
import { logger } from '@/utils/logger';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Validation schemas
const createAccountSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Account name is required'),
    type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT', 'CASH', 'LOAN', 'OTHER']),
    balance: z.number().default(0),
    currency: z.string().length(3).default('USD'),
    description: z.string().optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#00FFFF'),
    icon: z.string().optional(),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    routingNumber: z.string().optional(),
    creditLimit: z.number().positive().optional(),
    interestRate: z.number().min(0).max(1).optional(),
  }),
});

const updateAccountSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    balance: z.number().optional(),
    description: z.string().optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    icon: z.string().optional(),
    isActive: z.boolean().optional(),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    routingNumber: z.string().optional(),
    creditLimit: z.number().positive().optional(),
    interestRate: z.number().min(0).max(1).optional(),
  }),
});

// Get all accounts for the authenticated user
router.get('/', asyncHandler(async (req: any, res: any) => {
  const accounts = await prisma.account.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });

  // Calculate total balance by account type
  const summary = accounts.reduce((acc, account) => {
    const balance = parseFloat(account.balance.toString());
    acc.totalBalance += balance;
    acc.byType[account.type] = (acc.byType[account.type] ?? 0) + balance;
    return acc;
  }, {
    totalBalance: 0,
    byType: {} as Record<string, number>,
  });

  res.json({
    status: 'success',
    data: {
      accounts,
      summary,
    },
  });
}));

// Get a specific account
router.get('/:id', asyncHandler(async (req: any, res: any) => {
  const account = await prisma.account.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.userId,
    },
    include: {
      transactions: {
        orderBy: { date: 'desc' },
        take: 10,
        include: {
          category: {
            select: { name: true, color: true, icon: true },
          },
        },
      },
      _count: {
        select: { transactions: true },
      },
    },
  });

  if (!account) {
    throw createError('Account not found', 404);
  }

  res.json({
    status: 'success',
    data: { account },
  });
}));

// Create a new account
router.post('/', validateRequest(createAccountSchema), asyncHandler(async (req: any, res: any) => {
  const accountData = req.body;

  const account = await prisma.account.create({
    data: {
      ...accountData,
      userId: req.user.userId,
    },
  });

  logger.info(`New account created: ${account.name} by ${req.user.username}`);

  res.status(201).json({
    status: 'success',
    message: 'Account created successfully',
    data: { account },
  });
}));

// Update an account
router.put('/:id', validateRequest(updateAccountSchema), asyncHandler(async (req: any, res: any) => {
  const accountId = req.params.id;
  const updateData = req.body;

  // Check if account exists and belongs to user
  const existingAccount = await prisma.account.findFirst({
    where: {
      id: accountId,
      userId: req.user.userId,
    },
  });

  if (!existingAccount) {
    throw createError('Account not found', 404);
  }

  const account = await prisma.account.update({
    where: { id: accountId },
    data: updateData,
  });

  logger.info(`Account updated: ${account.name} by ${req.user.username}`);

  res.json({
    status: 'success',
    message: 'Account updated successfully',
    data: { account },
  });
}));

// Delete an account
router.delete('/:id', asyncHandler(async (req: any, res: any) => {
  const accountId = req.params.id;

  // Check if account exists and belongs to user
  const existingAccount = await prisma.account.findFirst({
    where: {
      id: accountId,
      userId: req.user.userId,
    },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });

  if (!existingAccount) {
    throw createError('Account not found', 404);
  }

  // Check if account has transactions
  if (existingAccount._count.transactions > 0) {
    throw createError('Cannot delete account with existing transactions', 400);
  }

  await prisma.account.delete({
    where: { id: accountId },
  });

  logger.info(`Account deleted: ${existingAccount.name} by ${req.user.username}`);

  res.json({
    status: 'success',
    message: 'Account deleted successfully',
  });
}));

// Get account balance history
router.get('/:id/balance-history', asyncHandler(async (req: any, res: any) => {
  const accountId = req.params.id;
  const { period = '30' } = req.query;

  // Check if account exists and belongs to user
  const account = await prisma.account.findFirst({
    where: {
      id: accountId,
      userId: req.user.userId,
    },
  });

  if (!account) {
    throw createError('Account not found', 404);
  }

  // Get transactions for the period
  const days = parseInt(period as string);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const transactions = await prisma.transaction.findMany({
    where: {
      accountId,
      date: {
        gte: startDate,
      },
    },
    orderBy: { date: 'asc' },
    select: {
      id: true,
      amount: true,
      type: true,
      date: true,
    },
  });

  // Calculate balance history
  let runningBalance = parseFloat(account.balance.toString());
  const balanceHistory = [];

  // Start with current balance and work backwards
  const reversedTransactions = [...transactions].reverse();
  
  for (const transaction of reversedTransactions) {
    const amount = parseFloat(transaction.amount.toString());
    if (transaction.type === 'INCOME') {
      runningBalance -= amount;
    } else if (transaction.type === 'EXPENSE') {
      runningBalance += amount;
    }
  }

  // Now work forwards to build the history
  balanceHistory.push({
    date: startDate,
    balance: runningBalance,
  });

  for (const transaction of transactions) {
    const amount = parseFloat(transaction.amount.toString());
    if (transaction.type === 'INCOME') {
      runningBalance += amount;
    } else if (transaction.type === 'EXPENSE') {
      runningBalance -= amount;
    }
    
    balanceHistory.push({
      date: transaction.date,
      balance: runningBalance,
    });
  }

  res.json({
    status: 'success',
    data: {
      accountId,
      period: days,
      balanceHistory,
    },
  });
}));

export default router;
