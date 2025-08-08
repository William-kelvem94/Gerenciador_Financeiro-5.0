import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const updateUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  email: z.string().optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
});

// Apply authentication to all routes
router.use(authenticateToken as express.RequestHandler);

// GET /api/users/profile - Perfil do usuário logado
router.get('/profile', (async (req: AuthenticatedRequest, res: express.Response) => {
  const userId = (req.user as { id: string })?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            accounts: true,
            transactions: true,
            budgets: true,
            goals: true,
          }
        }
      },
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao buscar perfil do usuário' });
  }
}) as express.RequestHandler);

// PUT /api/users/profile - Atualiza perfil do usuário
router.put('/profile', async (req, res) => {
  try {
    const validatedData = updateUserSchema.parse(req.body);

    // Se está mudando email, verificar se já existe
    if (validatedData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: validatedData.email,
          id: { not: (req.user as { id: string }).id },
        },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Este email já está em uso',
        });
      }
    }

    // Se está mudando a senha, criptografar
    const updateData: Record<string, unknown> = { ...validatedData };
    if (updateData.password && typeof updateData.password === 'string') {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: (req.user as { id: string }).id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      data: updatedUser,
      message: 'Perfil atualizado com sucesso',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.issues,
      });
    }
    // log removido para produção
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao atualizar perfil' 
    });
  }
});

// POST /api/users/change-password - Altera senha do usuário
router.post('/change-password', async (req, res) => {
  try {
    const validatedData = changePasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: (req.user as { id: string }).id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Senha atual incorreta',
      });
    }

    // Criptografar nova senha
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 10);

    await prisma.user.update({
      where: { id: (req.user as { id: string }).id },
      data: { password: hashedNewPassword },
    });

    res.json({
      success: true,
      message: 'Senha alterada com sucesso',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.issues,
      });
    }

    // log removido para produção
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao alterar senha' 
    });
  }
});

// DELETE /api/users/account - Remove conta do usuário
router.delete('/account', async (req, res) => {
  try {
    const { confirmPassword } = req.body;

    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Senha de confirmação é obrigatória',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: (req.user as { id: string }).id },
      include: {
        _count: {
          select: {
            accounts: true,
            transactions: true,
            budgets: true,
            goals: true,
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(confirmPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Senha incorreta',
      });
    }

    // Deletar todos os dados do usuário em uma transação
    await prisma.$transaction(async (tx) => {
      // Deletar transações
      await tx.transaction.deleteMany({
        where: { userId: (req.user as { id: string }).id },
      });

      // Deletar orçamentos
      await tx.budget.deleteMany({
        where: { userId: (req.user as { id: string }).id },
      });

      // Deletar metas
      await tx.goal.deleteMany({
        where: { userId: (req.user as { id: string }).id },
      });

      // Deletar contas
      await tx.account.deleteMany({
        where: { userId: (req.user as { id: string }).id },
      });

      // Deletar categorias customizadas
      await tx.category.deleteMany({
        where: { userId: (req.user as { id: string }).id },
      });

      // Deletar usuário
      await tx.user.delete({
        where: { id: (req.user as { id: string }).id },
      });
    });

    res.json({
      success: true,
      message: 'Conta removida com sucesso',
    });
  } catch {
    // log removido para produção
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao remover conta' 
    });
  }
});

// GET /api/users/stats - Estatísticas gerais do usuário
router.get('/stats', async (req, res) => {
  try {
    const userId = (req.user as { id: string }).id;

    const [
      accountsCount,
      transactionsCount,
      budgetsCount,
      goalsCount,
      totalBalance,
      lastTransactions,
    ] = await Promise.all([
      prisma.account.count({ where: { userId } }),
      prisma.transaction.count({ where: { userId } }),
      prisma.budget.count({ where: { userId } }),
      prisma.goal.count({ where: { userId } }),
      prisma.account.aggregate({
        where: { userId },
        _sum: { balance: true },
      }),
      prisma.transaction.findMany({
        where: { userId },
        take: 5,
        orderBy: { date: 'desc' },
        include: {
          account: { select: { name: true } },
          category: { select: { name: true, icon: true } },
        },
      }),
    ]);

    const stats = {
      accounts: accountsCount,
      transactions: transactionsCount,
      budgets: budgetsCount,
      goals: goalsCount,
      totalBalance: totalBalance._sum.balance || 0,
      lastTransactions,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch {
    // log removido para produção
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar estatísticas do usuário' 
    });
  }
});

export { router as userRoutes };
