import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
    type: z.enum(['income', 'expense']),
  icon: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
});

const updateCategorySchema = createCategorySchema.partial();

// Corrigir uso do middleware para Express
router.use(authenticateToken as any);

router.get('/', async (req, res) => {
  try {
    const { type, includeDefault = 'true' } = req.query;
    const userId = (req.user as { id: string })?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    }
    const where: Record<string, unknown> = {};
    if (includeDefault === 'true') {
      where.OR = [
        { userId },
        { userId: null }
      ];
    } else {
      where.userId = userId;
    }
    if (type) where.type = type;
    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: { transactions: true }
        }
      },
      orderBy: [
        { userId: 'asc' },
        { name: 'asc' }
      ],
    });
    res.json({ success: true, data: categories });
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao buscar categorias' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await prisma.category.findFirst({
      where: {
        id: req.params.id,
        OR: [
            { userId: (req.user as { id: string })?.id },
          { userId: null }
        ]
      },
      include: {
        _count: {
          select: { transactions: true }
        },
        transactions: {
            where: { userId: (req.user as { id: string })?.id },
          take: 10,
          orderBy: { date: 'desc' },
          include: {
            account: { select: { id: true, name: true, type: true } },
          },
        },
      },
    });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada',
      });
    }
    res.json({
      success: true,
      data: category,
    });
  } catch {
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar categoria' 
    });
  }
});

// POST /api/categories - Cria nova categoria
router.post('/', async (req, res) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);

    // Verificar se já existe uma categoria com esse nome para o usuário
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: validatedData.name,
        type: validatedData.type,
  userId: (req.user as { id: string })?.id,
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Já existe uma categoria com esse nome e tipo',
      });
    }

    const category = await prisma.category.create({
      data: {
        ...validatedData,
  userId: (req.user as { id: string })?.id,
      },
    });

    res.status(201).json({
      success: true,
      data: category,
      message: 'Categoria criada com sucesso',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.issues,
      });
    }
    res.status(500).json({ success: false, message: 'Erro ao criar categoria' });
  }
});

// PUT /api/categories/:id - Atualiza categoria
router.put('/:id', async (req, res) => {
  try {
    const validatedData = updateCategorySchema.parse(req.body);

    const category = await prisma.category.findFirst({
      where: {
        id: req.params.id,
  userId: (req.user as { id: string })?.id, // apenas categorias do usuário podem ser editadas
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada ou não pode ser editada',
      });
    }

    // Verificar se mudou o nome/tipo e se já existe outra categoria com esse nome e tipo
    if ((validatedData.name && validatedData.name !== category.name) || 
        (validatedData.type && validatedData.type !== category.type)) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: validatedData.name || category.name,
          type: validatedData.type || category.type,
          userId: (req.user as { id: string })?.id,
          id: { not: req.params.id },
        },
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Já existe uma categoria com esse nome e tipo',
        });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: req.params.id },
      data: validatedData,
    });

    res.json({
      success: true,
      data: updatedCategory,
      message: 'Categoria atualizada com sucesso',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.issues,
      });
    }
    res.status(500).json({ success: false, message: 'Erro ao atualizar categoria' });
  }
});

// DELETE /api/categories/:id - Remove categoria
router.delete('/:id', async (req, res) => {
  try {
    const category = await prisma.category.findFirst({
      where: {
        id: req.params.id,
  userId: (req.user as { id: string })?.id, // apenas categorias do usuário podem ser removidas
      },
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada ou não pode ser removida',
      });
    }

    // Verificar se a categoria tem transações
    if (category._count.transactions > 0) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir uma categoria que possui transações',
      });
    }

    await prisma.category.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: 'Categoria removida com sucesso',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao remover categoria' });
  }
});

// GET /api/categories/stats/usage - Estatísticas de uso das categorias
router.get('/stats/usage', async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    const where: Record<string, unknown> = {
  userId: (req.user as { id: string })?.id,
    };

    if (type) where.type = type;
    if (startDate || endDate) {
      where.date = {} as { gte?: Date; lte?: Date };
      if (startDate) (where.date as { gte?: Date }).gte = new Date(startDate as string);
      if (endDate) (where.date as { lte?: Date }).lte = new Date(endDate as string);
    }

    const categoryStats = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where,
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    // Buscar informações das categorias
    const categoryIds = categoryStats.map(stat => stat.categoryId);
    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds },
      },
      select: {
        id: true,
        name: true,
        type: true,
        icon: true,
        color: true,
      },
    });

    const result = categoryStats.map(stat => {
      const category = categories.find(cat => cat.id === stat.categoryId);
      return {
        category,
        totalAmount: stat._sum.amount || 0,
        transactionCount: stat._count.id,
      };
    }).sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0));

    res.json({
      success: true,
      data: result,
    });
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao buscar estatísticas das categorias' });
  }
});

export { router as categoryRoutes };
