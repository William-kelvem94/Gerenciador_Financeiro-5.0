import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto, UpdateBudgetDto } from './dto/budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBudgetDto: CreateBudgetDto) {
    const { name, amount, period, startDate, endDate } = createBudgetDto;

    const budget = await this.prisma.budget.create({
      data: {
        name,
        amount,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId,
      },
    });

    return budget;
  }

  async findAll(userId: string) {
    const budgets = await this.prisma.budget.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await this.calculateSpentAmount(budget.id, budget.startDate, budget.endDate);
        return {
          ...budget,
          spent,
          remaining: budget.amount - spent,
          percentageUsed: (spent / budget.amount) * 100,
        };
      }),
    );

    return budgetsWithSpent;
  }

  async findOne(userId: string, id: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    const spent = await this.calculateSpentAmount(budget.id, budget.startDate, budget.endDate);

    return {
      ...budget,
      spent,
      remaining: budget.amount - spent,
      percentageUsed: (spent / budget.amount) * 100,
    };
  }

  async update(userId: string, id: string, updateBudgetDto: UpdateBudgetDto) {
    const existingBudget = await this.findOne(userId, id);

    const updatedBudget = await this.prisma.budget.update({
      where: { id },
      data: {
        ...(updateBudgetDto.name !== undefined && { name: updateBudgetDto.name }),
        ...(updateBudgetDto.amount !== undefined && { amount: updateBudgetDto.amount }),
        ...(updateBudgetDto.period !== undefined && { period: updateBudgetDto.period }),
        ...(updateBudgetDto.startDate !== undefined && { startDate: new Date(updateBudgetDto.startDate) }),
        ...(updateBudgetDto.endDate !== undefined && { endDate: new Date(updateBudgetDto.endDate) }),
        ...(updateBudgetDto.isActive !== undefined && { isActive: updateBudgetDto.isActive }),
      },
    });

    const spent = await this.calculateSpentAmount(updatedBudget.id, updatedBudget.startDate, updatedBudget.endDate);

    return {
      ...updatedBudget,
      spent,
      remaining: updatedBudget.amount - spent,
      percentageUsed: (spent / updatedBudget.amount) * 100,
    };
  }

  async remove(userId: string, id: string) {
    const budget = await this.findOne(userId, id);

    await this.prisma.budget.delete({
      where: { id },
    });

    return { message: 'Budget deleted successfully' };
  }

  async getBudgetOverview(userId: string) {
    const budgets = await this.findAll(userId);
    
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
    const totalRemaining = totalBudget - totalSpent;
    
    const overBudgetCount = budgets.filter(budget => budget.spent > budget.amount).length;
    const activeBudgets = budgets.filter(budget => budget.isActive).length;

    return {
      totalBudget,
      totalSpent,
      totalRemaining,
      overBudgetCount,
      activeBudgets,
      totalBudgets: budgets.length,
      budgets: budgets.slice(0, 5), // Latest 5 budgets
    };
  }

  private async calculateSpentAmount(budgetId: string, startDate: Date, endDate: Date): Promise<number> {
    // This is a simplified calculation - in a real app, you might want to link budgets to specific categories
    const result = await this.prisma.transaction.aggregate({
      where: {
        type: 'expense',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || 0;
  }
}