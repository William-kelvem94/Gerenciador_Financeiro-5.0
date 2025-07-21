import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken } from './auth';

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticateToken);

// Validation schemas
const createBudgetSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  period: z.enum(['monthly', 'yearly']),
  startDate: z.string(),
  endDate: z.string(),
});

const updateBudgetSchema = z.object({
  name: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  period: z.enum(['monthly', 'yearly']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
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
        ...data,
        userId: req.user.userId,
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
