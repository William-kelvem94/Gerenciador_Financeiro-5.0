import express from 'express';
import { z } from 'zod';
import { prisma } from '../db/client';
import { authenticateToken } from './auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Validation schemas
const createBudgetSchema = z.object({
  name: z.string().min(1, 'Budget name is required'),
  amount: z.number().positive('Amount must be positive'),
  period: z.enum(['monthly', 'yearly']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  categoryId: z.string().min(1, 'Category ID is required'),
});

const updateBudgetSchema = z.object({
  name: z.string().min(1, 'Budget name is required').optional(),
  amount: z.number().positive('Amount must be positive').optional(),
  period: z.enum(['monthly', 'yearly']).optional(),
  startDate: z.string().min(1, 'Start date is required').optional(),
  endDate: z.string().min(1, 'End date is required').optional(),
  isActive: z.boolean().optional(),
});

// Get all budgets
router.get('/', async (req: any, res) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ budgets });
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get budget by ID
router.get('/:id', async (req: any, res) => {
  try {
    const budget = await prisma.budget.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create budget
router.post('/', async (req: any, res) => {
  try {
    const data = createBudgetSchema.parse(req.body);

    const budget = await prisma.budget.create({
      data: {
        name: data.name,
        amount: data.amount,
        period: data.period,
        categoryId: data.categoryId,
        userId: req.user.userId as string,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });

    res.status(201).json(budget);
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update budget
router.put('/:id', async (req: any, res) => {
  try {
    const data = updateBudgetSchema.parse(req.body);

    const existingBudget = await prisma.budget.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

    if (!existingBudget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    const budget = await prisma.budget.update({
      where: { id: req.params.id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });

    res.json(budget);
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Delete budget
router.delete('/:id', async (req: any, res) => {
  try {
    const budget = await prisma.budget.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    await prisma.budget.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export { router as budgetRoutes };
