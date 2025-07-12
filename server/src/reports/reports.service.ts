import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportQueryDto, ReportPeriod } from './dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getFinancialOverview(userId: string, query: ReportQueryDto) {
    const { startDate, endDate, period = ReportPeriod.MONTHLY } = query;
    
    const dateFilter = this.buildDateFilter(startDate, endDate, period);

    const [income, expenses, transactionCount, categoryBreakdown] = await Promise.all([
      this.getTotalIncome(userId, dateFilter),
      this.getTotalExpenses(userId, dateFilter),
      this.getTransactionCount(userId, dateFilter),
      this.getCategoryBreakdown(userId, dateFilter),
    ]);

    return {
      period,
      dateRange: dateFilter,
      summary: {
        totalIncome: income,
        totalExpenses: expenses,
        netIncome: income - expenses,
        transactionCount,
      },
      categoryBreakdown,
    };
  }

  async getIncomeVsExpenses(userId: string, query: ReportQueryDto) {
    const { startDate, endDate, period = ReportPeriod.MONTHLY } = query;
    
    const dateFilter = this.buildDateFilter(startDate, endDate, period);
    
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: dateFilter,
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
      orderBy: { date: 'asc' },
    });

    // Group by time period
    const groupedData = this.groupTransactionsByPeriod(transactions, period);

    return {
      period,
      data: groupedData,
    };
  }

  async getCashFlow(userId: string, query: ReportQueryDto) {
    const { startDate, endDate, period = ReportPeriod.MONTHLY } = query;
    
    const dateFilter = this.buildDateFilter(startDate, endDate, period);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: dateFilter,
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
      orderBy: { date: 'asc' },
    });

    let runningBalance = 0;
    const cashFlowData = transactions.map(transaction => {
      if (transaction.type === 'income') {
        runningBalance += transaction.amount;
      } else if (transaction.type === 'expense') {
        runningBalance -= transaction.amount;
      }

      return {
        date: transaction.date,
        amount: transaction.amount,
        type: transaction.type,
        runningBalance,
      };
    });

    return {
      period,
      data: cashFlowData,
    };
  }

  async getTopCategories(userId: string, query: ReportQueryDto) {
    const { startDate, endDate } = query;
    
    const dateFilter = this.buildDateFilter(startDate, endDate);

    const categoryTotals = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        date: dateFilter,
        type: 'expense',
      },
      _sum: {
        amount: true,
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
      take: 10,
    });

    // Get category details
    const categories = await this.prisma.category.findMany({
      where: {
        id: {
          in: categoryTotals.map(ct => ct.categoryId),
        },
      },
    });

    const result = categoryTotals.map(ct => {
      const category = categories.find(c => c.id === ct.categoryId);
      return {
        category: category || { id: ct.categoryId, name: 'Unknown', icon: '❓', color: '#gray' },
        totalAmount: ct._sum.amount || 0,
        transactionCount: ct._count._all,
      };
    });

    return result;
  }

  async getMonthlyTrends(userId: string) {
    const last12Months = new Date();
    last12Months.setMonth(last12Months.getMonth() - 12);

    const monthlyData = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId,
        date: {
          gte: last12Months,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
    });

    // Group by month and type
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: last12Months,
        },
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
    });

    const monthlyTrends = this.groupTransactionsByMonth(transactions);

    return {
      period: 'last12Months',
      monthlyTrends,
      totals: monthlyData,
    };
  }

  private buildDateFilter(startDate?: string, endDate?: string, period?: ReportPeriod) {
    const filter: any = {};

    if (startDate && endDate) {
      filter.gte = new Date(startDate);
      filter.lte = new Date(endDate);
    } else if (period) {
      const now = new Date();
      switch (period) {
        case ReportPeriod.DAILY:
          filter.gte = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case ReportPeriod.WEEKLY:
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          filter.gte = weekStart;
          break;
        case ReportPeriod.MONTHLY:
          filter.gte = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case ReportPeriod.YEARLY:
          filter.gte = new Date(now.getFullYear(), 0, 1);
          break;
      }
      filter.lte = now;
    }

    return filter;
  }

  private async getTotalIncome(userId: string, dateFilter: any) {
    const result = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'income',
        date: dateFilter,
      },
      _sum: {
        amount: true,
      },
    });
    return result._sum.amount || 0;
  }

  private async getTotalExpenses(userId: string, dateFilter: any) {
    const result = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'expense',
        date: dateFilter,
      },
      _sum: {
        amount: true,
      },
    });
    return result._sum.amount || 0;
  }

  private async getTransactionCount(userId: string, dateFilter: any) {
    return this.prisma.transaction.count({
      where: {
        userId,
        date: dateFilter,
      },
    });
  }

  private async getCategoryBreakdown(userId: string, dateFilter: any) {
    return this.prisma.transaction.groupBy({
      by: ['categoryId', 'type'],
      where: {
        userId,
        date: dateFilter,
      },
      _sum: {
        amount: true,
      },
      _count: {
        _all: true,
      },
    });
  }

  private groupTransactionsByPeriod(transactions: any[], period: ReportPeriod) {
    const grouped = new Map();

    transactions.forEach(transaction => {
      let key: string;
      const date = new Date(transaction.date);

      switch (period) {
        case ReportPeriod.DAILY:
          key = date.toISOString().split('T')[0];
          break;
        case ReportPeriod.WEEKLY:
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case ReportPeriod.MONTHLY:
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case ReportPeriod.YEARLY:
          key = String(date.getFullYear());
          break;
        default:
          key = date.toISOString().split('T')[0];
      }

      if (!grouped.has(key)) {
        grouped.set(key, { income: 0, expenses: 0, date: key });
      }

      const entry = grouped.get(key);
      if (transaction.type === 'income') {
        entry.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        entry.expenses += transaction.amount;
      }
    });

    return Array.from(grouped.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  private groupTransactionsByMonth(transactions: any[]) {
    const grouped = new Map();

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!grouped.has(key)) {
        grouped.set(key, { month: key, income: 0, expenses: 0 });
      }

      const entry = grouped.get(key);
      if (transaction.type === 'income') {
        entry.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        entry.expenses += transaction.amount;
      }
    });

    return Array.from(grouped.values()).sort((a, b) => a.month.localeCompare(b.month));
  }
}