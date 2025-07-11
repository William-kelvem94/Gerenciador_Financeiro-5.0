import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/config/database';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import { validateRequest } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';
import { logger } from '@/utils/logger';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Validation schemas
const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    bio: z.string().max(500).optional(),
    location: z.string().max(100).optional(),
    website: z.string().url().optional(),
    phone: z.string().optional(),
    dateOfBirth: z.string().datetime().optional(),
  }),
});

const updatePreferencesSchema = z.object({
  body: z.object({
    currency: z.string().length(3).optional(),
    language: z.string().length(2).optional(),
    timezone: z.string().optional(),
    theme: z.enum(['cyberpunk', 'dark', 'light']).optional(),
    monthlyBudget: z.number().positive().optional(),
    savingsGoal: z.number().positive().optional(),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
  }),
});

// Get current user profile
router.get('/profile', asyncHandler(async (req: any, res: any) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
      currency: true,
      language: true,
      timezone: true,
      theme: true,
      monthlyBudget: true,
      savingsGoal: true,
      emailVerified: true,
      twoFactorEnabled: true,
      createdAt: true,
      updatedAt: true,
      lastLoginAt: true,
    },
  });

  if (!user) {
    throw createError('User not found', 404);
  }

  res.json({
    status: 'success',
    data: { user },
  });
}));

// Update user profile
router.put('/profile', validateRequest(updateProfileSchema), asyncHandler(async (req: any, res: any) => {
  const { firstName, lastName, bio, location, website, phone, dateOfBirth } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(bio !== undefined && { bio }),
      ...(location !== undefined && { location }),
      ...(website !== undefined && { website }),
      ...(phone !== undefined && { phone }),
      ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
    },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
      updatedAt: true,
    },
  });

  logger.info(`User profile updated: ${user.username}`);

  res.json({
    status: 'success',
    message: 'Profile updated successfully',
    data: { user },
  });
}));

// Update user preferences
router.put('/preferences', validateRequest(updatePreferencesSchema), asyncHandler(async (req: any, res: any) => {
  const { currency, language, timezone, theme, monthlyBudget, savingsGoal } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: {
      ...(currency && { currency }),
      ...(language && { language }),
      ...(timezone && { timezone }),
      ...(theme && { theme }),
      ...(monthlyBudget !== undefined && { monthlyBudget }),
      ...(savingsGoal !== undefined && { savingsGoal }),
    },
    select: {
      currency: true,
      language: true,
      timezone: true,
      theme: true,
      monthlyBudget: true,
      savingsGoal: true,
      updatedAt: true,
    },
  });

  logger.info(`User preferences updated: ${req.user.username}`);

  res.json({
    status: 'success',
    message: 'Preferences updated successfully',
    data: { preferences: user },
  });
}));

// Change password
router.put('/password', validateRequest(changePasswordSchema), asyncHandler(async (req: any, res: any) => {
  const { currentPassword, newPassword } = req.body;

  // Get current user with password
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
  });

  if (!user) {
    throw createError('User not found', 404);
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    throw createError('Current password is incorrect', 400);
  }

  // Hash new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  // Update password
  await prisma.user.update({
    where: { id: req.user.userId },
    data: { password: hashedNewPassword },
  });

  // Note: In production, all sessions would be invalidated from session store
  logger.info(`Password changed for user: ${user.username}`);

  res.json({
    status: 'success',
    message: 'Password changed successfully. Please log in again.',
  });
}));

// Get user statistics
router.get('/statistics', asyncHandler(async (req: any, res: any) => {
  const userId = req.user.userId;

  // Get various statistics
  const [
    totalAccounts,
    totalTransactions,
    totalCategories,
    totalBudgets,
    totalGoals,
    recentTransactions,
  ] = await Promise.all([
    prisma.account.count({ where: { userId } }),
    prisma.transaction.count({ where: { userId } }),
    prisma.category.count({ where: { userId } }),
    prisma.budget.count({ where: { userId } }),
    prisma.goal.count({ where: { userId } }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        category: { select: { name: true, color: true, icon: true } },
        account: { select: { name: true, type: true } },
      },
    }),
  ]);

  // Calculate total balance across all accounts
  const accounts = await prisma.account.findMany({
    where: { userId },
    select: { balance: true, type: true },
  });

  const totalBalance = accounts.reduce((sum: any, account: any) => {
    return sum + parseFloat(account.balance.toString());
  }, 0);

  res.json({
    status: 'success',
    data: {
      statistics: {
        totalAccounts,
        totalTransactions,
        totalCategories,
        totalBudgets,
        totalGoals,
        totalBalance,
      },
      recentTransactions,
    },
  });
}));

// Delete user account
router.delete('/account', asyncHandler(async (req: any, res: any) => {
  const userId = req.user.userId;

  // Delete user and all related data (cascade delete)
  await prisma.user.delete({
    where: { id: userId },
  });

  logger.info(`User account deleted: ${req.user.username}`);

  res.json({
    status: 'success',
    message: 'Account deleted successfully',
  });
}));

export default router;
