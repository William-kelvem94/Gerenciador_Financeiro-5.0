/**
 * Serviço responsável pela gestão de orçamentos financeiros.
 * Implementa validação, auditoria, alertas e integração futura com IA.
 */
import { PrismaClient } from '@prisma/client';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { validateCreateBudget, validateUpdateBudget } from '../validators/budget.validator';

export class BudgetService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateBudgetDto) {
    const validation = validateCreateBudget(data);
    if (!validation.success) {
      throw new Error('Dados inválidos: ' + JSON.stringify(validation.error.issues));
    }
    // TODO: Integrar IA para alertas inteligentes
    return this.prisma.budget.create({ data });
  }

  async update(data: UpdateBudgetDto) {
    const validation = validateUpdateBudget(data);
    if (!validation.success) {
      throw new Error('Dados inválidos: ' + JSON.stringify(validation.error.issues));
    }
    return this.prisma.budget.update({
      where: { id: data.id },
      data
    });
  }

  async delete(id: string) {
    return this.prisma.budget.delete({ where: { id } });
  }

  async findById(id: string) {
    return this.prisma.budget.findUnique({ where: { id } });
  }

  async findAll(params: { userId: string; period?: string; category?: string; }) {
    // Filtros avançados, paginação, etc.
    return this.prisma.budget.findMany({
      where: {
        userId: params.userId,
        ...(params.period && { period: params.period }),
        ...(params.category && { categories: { has: params.category } })
      },
      orderBy: { startDate: 'desc' }
    });
  }
}
