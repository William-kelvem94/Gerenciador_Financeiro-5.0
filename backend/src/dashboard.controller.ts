import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction/transaction.entity';

@Controller('dashboard')
export class DashboardController {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  @Get()
  async getDashboard() {
    try {
      const transactions = await this.repo.find({
        order: { createdAt: 'DESC' }
      });

      // Calcular totais
      const totalIncome = transactions
        .filter(t => t.tipo === 'income')
        .reduce((sum, t) => sum + Number(t.valor), 0);
      
      const totalExpenses = transactions
        .filter(t => t.tipo === 'expense')
        .reduce((sum, t) => sum + Number(t.valor), 0);

      const balance = totalIncome - totalExpenses;

      // Calcular totais mensais (último mês)
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      const monthlyTransactions = transactions.filter(t => 
        new Date(t.createdAt) >= oneMonthAgo
      );
      
      const monthlyIncome = monthlyTransactions
        .filter(t => t.tipo === 'income')
        .reduce((sum, t) => sum + Number(t.valor), 0);
      
      const monthlyExpenses = monthlyTransactions
        .filter(t => t.tipo === 'expense')
        .reduce((sum, t) => sum + Number(t.valor), 0);

      const monthlyBalance = monthlyIncome - monthlyExpenses;

      // Transações recentes (últimas 10)
      const recentTransactions = transactions.slice(0, 10).map(t => ({
        id: t.id,
        description: t.descricao,
        amount: Number(t.valor),
        type: t.tipo,
        category: t.categoria,
        account: t.conta || 'Conta Principal',
        date: t.createdAt,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt
      }));

      // Breakdown por categoria
      const categoryBreakdown = transactions
        .filter(t => t.tipo === 'expense')
        .reduce((acc, t) => {
          const found = acc.find(c => c.category === t.categoria);
          if (found) {
            found.amount += Number(t.valor);
            found.transactions += 1;
          } else {
            acc.push({
              category: t.categoria,
              amount: Number(t.valor),
              transactions: 1,
              color: this.getCategoryColor(t.categoria),
              percentage: 0
            });
          }
          return acc;
        }, [] as any[]);

      // Calcular percentuais
      categoryBreakdown.forEach(cat => {
        cat.percentage = totalExpenses > 0 ? Math.round((cat.amount / totalExpenses) * 100) : 0;
      });

      // Tendência mensal (últimos 6 meses)
      const monthlyTrend = this.getMonthlyTrend(transactions);

      return {
        totalIncome,
        totalExpenses,
        balance,
        monthlyIncome,
        monthlyExpenses,
        monthlyBalance,
        recentTransactions,
        categoryBreakdown,
        monthlyTrend
      };
    } catch (error) {
      console.error('Erro no dashboard:', error);
      return {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        monthlyBalance: 0,
        recentTransactions: [],
        categoryBreakdown: [],
        monthlyTrend: []
      };
    }
  }

  private getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'Alimentação': '#FF5722',
      'Transporte': '#FF9800',
      'Moradia': '#F44336',
      'Saúde': '#E91E63',
      'Educação': '#9C27B0',
      'Lazer': '#673AB7',
      'Compras': '#3F51B5',
      'Serviços': '#2196F3',
      'Salário': '#4CAF50',
      'Freelance': '#8BC34A'
    };
    return colors[category] || '#757575';
  }

  private getMonthlyTrend(transactions: Transaction[]) {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.createdAt);
        return date >= month && date < nextMonth;
      });
      
      const income = monthTransactions
        .filter(t => t.tipo === 'income')
        .reduce((sum, t) => sum + Number(t.valor), 0);
      
      const expenses = monthTransactions
        .filter(t => t.tipo === 'expense')
        .reduce((sum, t) => sum + Number(t.valor), 0);
      
      months.push({
        month: month.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        income,
        expenses,
        balance: income - expenses
      });
    }
    
    return months;
  }
}
