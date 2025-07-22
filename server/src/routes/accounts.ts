import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const createAccountSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['checking', 'savings', 'credit', 'investment'], {
    errorMap: () => ({ message: 'Tipo deve ser checking, savings, credit ou investment' })
  }),
  balance: z.number().default(0),
  bank: z.string().optional(),
  description: z.string().optional(),
});

const updateAccountSchema = createAccountSchema.partial();

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/accounts - Lista todas as contas do usuário
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { includeBalance = 'true', type } = req.query;
    
    const where: any = {
      userId: req.user!.id,
    };

    if (type) where.type = type;

    const accounts = await prisma.account.findMany({
      where,
      include: includeBalance === 'true' ? {
        _count: {
          select: { transactions: true }
        }
      } : false,
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: accounts,
    });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar contas' 
    });
  }
});

// GET /api/accounts/:id - Busca uma conta específica
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        _count: {
          select: { transactions: true }
        },
        transactions: {
          take: 10,
          orderBy: { date: 'desc' },
          include: {
            category: { select: { id: true, name: true, icon: true, color: true } },
          },
        },
      },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Conta não encontrada',
      });
    }

    res.json({
      success: true,
      data: account,
    });
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar conta' 
    });
  }
});

// POST /api/accounts - Cria nova conta
router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const validatedData = createAccountSchema.parse(req.body);

    // Verificar se já existe uma conta com esse nome para o usuário
    const existingAccount = await prisma.account.findFirst({
      where: {
        name: validatedData.name,
        userId: req.user!.id,
      },
    });

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: 'Já existe uma conta com esse nome',
      });
    }

    const account = await prisma.account.create({
      data: {
        ...validatedData,
        userId: req.user!.id,
      },
    });

    res.status(201).json({
      success: true,
      data: account,
      message: 'Conta criada com sucesso',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors,
      });
    }

    console.error('Create account error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao criar conta' 
    });
  }
});

// PUT /api/accounts/:id - Atualiza conta
router.put('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const validatedData = updateAccountSchema.parse(req.body);

    const account = await prisma.account.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Conta não encontrada',
      });
    }

    // Verificar se mudou o nome e se já existe outra conta com esse nome
    if (validatedData.name && validatedData.name !== account.name) {
      const existingAccount = await prisma.account.findFirst({
        where: {
          name: validatedData.name,
          userId: req.user!.id,
          id: { not: req.params.id },
        },
      });

      if (existingAccount) {
        return res.status(400).json({
          success: false,
          message: 'Já existe uma conta com esse nome',
        });
      }
    }

    const updatedAccount = await prisma.account.update({
      where: { id: req.params.id },
      data: validatedData,
    });

    res.json({
      success: true,
      data: updatedAccount,
      message: 'Conta atualizada com sucesso',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors,
      });
    }

    console.error('Update account error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao atualizar conta' 
    });
  }
});

// DELETE /api/accounts/:id - Remove conta
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Conta não encontrada',
      });
    }

    // Verificar se a conta tem transações
    if (account._count.transactions > 0) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir uma conta que possui transações',
      });
    }

    await prisma.account.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: 'Conta removida com sucesso',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao remover conta' 
    });
  }
});

// GET /api/accounts/stats/summary - Estatísticas das contas
router.get('/stats/summary', async (req: AuthenticatedRequest, res) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: req.user!.id },
      select: {
        id: true,
        name: true,
        type: true,
        balance: true,
      },
    });

    const summary = {
      totalAccounts: accounts.length,
      totalBalance: accounts.reduce((sum, acc) => sum + acc.balance, 0),
      accountsByType: accounts.reduce((acc, account) => {
        acc[account.type] = (acc[account.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      balanceByType: accounts.reduce((acc, account) => {
        acc[account.type] = (acc[account.type] || 0) + account.balance;
        return acc;
      }, {} as Record<string, number>),
    };

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Get accounts stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar estatísticas das contas' 
    });
  }
});

export { router as accountRoutes };
