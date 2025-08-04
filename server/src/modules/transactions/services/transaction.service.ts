/**
 * 🔄 Transaction Service - Will Finance 5.0
 * 
 * Serviço responsável pela lógica de negócio das transações
 */

import { PrismaClient } from '@prisma/client';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFiltersDto,
  TransactionStatsDto,
  TransactionResponseDto,
  PaginatedTransactionsDto,
  TransactionStatsResponseDto,
} from '../dtos/transaction.dtos';

export class TransactionService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Buscar transações com filtros e paginação
   */
  async getTransactions(
    userId: string,
    filters: TransactionFiltersDto
  ): Promise<PaginatedTransactionsDto> {
    const {
      page = 1,
      limit = 10,
      type,
      categoryId,
      accountId,
      startDate,
      endDate,
      search,
    } = filters;

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: {
      userId: string;
      type?: string;
      categoryId?: string;
      accountId?: string;
      date?: {
        gte: Date;
        lte: Date;
      };
      OR?: Array<{
        description?: { contains: string; mode: 'insensitive' };
        notes?: { contains: string; mode: 'insensitive' };
        reference?: { contains: string; mode: 'insensitive' };
      }>;
    } = {
      userId,
      ...(type && { type }),
      ...(categoryId && { categoryId }),
      ...(accountId && { accountId }),
      ...(startDate && endDate && {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
      ...(search && {
        OR: [
          { description: { contains: search, mode: 'insensitive' } },
          { notes: { contains: search, mode: 'insensitive' } },
          { reference: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // Buscar transações
    const [transactions, totalCount] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          account: {
            select: {
              id: true,
              name: true,
              type: true,
              color: true,
              icon: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              color: true,
              icon: true,
              type: true,
            },
          },
        },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      transactions: transactions as TransactionResponseDto[],
      totalCount,
      totalPages,
      currentPage: page,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  /**
   * Buscar transação por ID
   */
  async getTransactionById(
    id: string,
    userId: string
  ): Promise<TransactionResponseDto | null> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
          },
        },
      },
    });

    return transaction as TransactionResponseDto | null;
  }

  /**
   * Criar nova transação
   */
  async createTransaction(
    data: CreateTransactionDto & { userId: string }
  ): Promise<TransactionResponseDto> {
    // Verificar se a conta pertence ao usuário
    const account = await this.prisma.account.findFirst({
      where: { id: data.accountId, userId: data.userId },
    });

    if (!account) {
      throw new Error('Conta não encontrada ou não pertence ao usuário');
    }

    // Verificar se a categoria pertence ao usuário ou é do sistema
    const category = await this.prisma.category.findFirst({
      where: {
        id: data.categoryId,
        OR: [{ userId: data.userId }, { isSystem: true }],
      },
    });

    if (!category) {
      throw new Error('Categoria não encontrada ou não acessível');
    }

    // Criar a transação
    const transaction = await this.prisma.transaction.create({
      data: {
        amount: data.amount,
        description: data.description,
        type: data.type,
        date: data.date || new Date(),
        accountId: data.accountId,
        categoryId: data.categoryId,
        userId: data.userId,
        notes: data.notes,
        location: data.location,
        reference: data.reference,
        isRecurring: data.isRecurring || false,
        recurringRule: data.recurringRule,
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
          },
        },
      },
    });

    // Atualizar saldo da conta
    await this.updateAccountBalance(data.accountId);

    return transaction as TransactionResponseDto;
  }

  /**
   * Atualizar transação existente
   */
  async updateTransaction(
    id: string,
    data: UpdateTransactionDto,
    userId: string
  ): Promise<TransactionResponseDto | null> {
    // Verificar se a transação existe e pertence ao usuário
    const existingTransaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!existingTransaction) {
      return null;
    }

    // Verificar conta se fornecida
    if (data.accountId) {
      const account = await this.prisma.account.findFirst({
        where: { id: data.accountId, userId },
      });

      if (!account) {
        throw new Error('Conta não encontrada ou não pertence ao usuário');
      }
    }

    // Verificar categoria se fornecida
    if (data.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: {
          id: data.categoryId,
          OR: [{ userId }, { isSystem: true }],
        },
      });

      if (!category) {
        throw new Error('Categoria não encontrada ou não acessível');
      }
    }

    // Atualizar a transação
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data,
      include: {
        account: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
          },
        },
      },
    });

    // Atualizar saldo das contas afetadas
    await this.updateAccountBalance(transaction.accountId);
    if (data.accountId && data.accountId !== existingTransaction.accountId) {
      await this.updateAccountBalance(existingTransaction.accountId);
    }

    return transaction as TransactionResponseDto;
  }

  /**
   * Deletar transação
   */
  async deleteTransaction(id: string, userId: string): Promise<boolean> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      return false;
    }

    await this.prisma.transaction.delete({
      where: { id },
    });

    // Atualizar saldo da conta
    await this.updateAccountBalance(transaction.accountId);

    return true;
  }

  /**
   * Obter estatísticas das transações
   */
  async getTransactionStats(
    userId: string,
    filters: TransactionStatsDto
  ): Promise<TransactionStatsResponseDto> {
    const { startDate, endDate } = filters;

    // Filtros de data
    const dateFilter = startDate && endDate
      ? {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }
      : {};

    // Buscar todas as transações do período
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        ...dateFilter,
      },
      include: {
        category: true,
        account: true,
      },
    });

    // Calcular estatísticas básicas
    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const netAmount = totalIncome - totalExpenses;
    const transactionCount = transactions.length;
    const averageTransaction = transactionCount > 0 
      ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactionCount 
      : 0;

    // Quebra por categoria
    interface CategoryBreakdownItem {
      categoryId: string;
      categoryName: string;
      categoryColor: string;
      categoryIcon: string;
      amount: number;
      transactionCount: number;
    }

    const categoryMap = new Map<string, CategoryBreakdownItem>();
    transactions.forEach(transaction => {
      const key = transaction.categoryId;
      if (!categoryMap.has(key)) {
        categoryMap.set(key, {
          categoryId: transaction.category.id,
          categoryName: transaction.category.name,
          categoryColor: transaction.category.color,
          categoryIcon: transaction.category.icon,
          amount: 0,
          transactionCount: 0,
        });
      }
      const category = categoryMap.get(key);
      category.amount += transaction.amount;
      category.transactionCount += 1;
    });

    const categoryBreakdown = Array.from(categoryMap.values()).map(cat => ({
      ...cat,
      percentage: transactionCount > 0 ? (cat.transactionCount / transactionCount) * 100 : 0,
    }));

    // Quebra por conta
    interface AccountBreakdownItem {
      accountId: string;
      accountName: string;
      accountColor: string;
      accountIcon: string;
      amount: number;
      transactionCount: number;
    }

    const accountMap = new Map<string, AccountBreakdownItem>();
    transactions.forEach(transaction => {
      const key = transaction.accountId;
      if (!accountMap.has(key)) {
        accountMap.set(key, {
          accountId: transaction.account.id,
          accountName: transaction.account.name,
          accountColor: transaction.account.color,
          accountIcon: transaction.account.icon,
          amount: 0,
          transactionCount: 0,
        });
      }
      const account = accountMap.get(key);
      account.amount += transaction.amount;
      account.transactionCount += 1;
    });

    const accountBreakdown = Array.from(accountMap.values()).map(acc => ({
      ...acc,
      percentage: transactionCount > 0 ? (acc.transactionCount / transactionCount) * 100 : 0,
    }));

    // Tendência mensal (últimos 12 meses)
    const monthlyTrend = this.calculateMonthlyTrend(transactions);

    return {
      totalIncome,
      totalExpenses,
      netAmount,
      transactionCount,
      averageTransaction,
      categoryBreakdown,
      accountBreakdown,
      monthlyTrend,
    };
  }

  /**
   * Atualizar saldo da conta baseado nas transações
   */
  private async updateAccountBalance(accountId: string): Promise<void> {
    const transactions = await this.prisma.transaction.findMany({
      where: { accountId },
    });

    const balance = transactions.reduce((sum, transaction) => {
      return transaction.type === 'INCOME' 
        ? sum + transaction.amount 
        : sum - transaction.amount;
    }, 0);

    await this.prisma.account.update({
      where: { id: accountId },
      data: { balance },
    });
  }

  /**
   * Calcular tendência mensal
   */
  private calculateMonthlyTrend(transactions: Array<{
    date: Date;
    type: string;
    amount: number;
  }>): Array<{
    month: string;
    income: number;
    expenses: number;
    net: number;
  }> {
    const monthlyData = new Map<string, { income: number; expenses: number }>();

    transactions.forEach(transaction => {
      const monthKey = transaction.date.toISOString().substring(0, 7); // YYYY-MM
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { income: 0, expenses: 0 });
      }

      const data = monthlyData.get(monthKey)!;
      if (transaction.type === 'INCOME') {
        data.income += transaction.amount;
      } else {
        data.expenses += transaction.amount;
      }
    });

    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
        net: data.income - data.expenses,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }
}
