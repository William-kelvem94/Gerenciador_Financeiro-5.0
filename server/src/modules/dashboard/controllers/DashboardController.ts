import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DashboardController {
  
  /**
   * GET /api/dashboard/stats
   * Obter estatísticas do dashboard do usuário logado
   */
  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      // Buscar contas do usuário
      const accounts = await prisma.account.findMany({
        where: { userId },
        select: { balance: true, isActive: true }
      });

      // Calcular saldo total das contas ativas
      const totalBalance = accounts
        .filter(account => account.isActive)
        .reduce((sum, account) => sum + account.balance, 0);

      // Buscar transações do mês atual
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      const monthlyTransactions = await prisma.transaction.findMany({
        where: {
          userId,
          date: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        select: { amount: true, type: true }
      });

      // Calcular receitas e despesas mensais
      const monthlyIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyExpenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      // Buscar meta de poupança do usuário
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { savingsGoal: true }
      });

      // Contar total de transações do usuário
      const transactionCount = await prisma.transaction.count({
        where: { userId }
      });

      const stats = {
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        savingsGoal: user?.savingsGoal || 0,
        transactions: transactionCount
      };

      res.json(stats);
    } catch (error) {
      // TODO: Implement proper logging here (e.g., using a logger service)
      // logger.error('Erro ao buscar transações recentes:', error);
      res.status(500).json({ error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * GET /api/dashboard/recent-transactions
   * Obter transações recentes do usuário
   */
  async getRecentTransactions(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const transactions = await prisma.transaction.findMany({
        where: { userId },
        include: {
          category: { select: { name: true, icon: true, color: true } },
          account: { select: { name: true } }
        },
        orderBy: { date: 'desc' },
        take: 10
      });

      res.json(transactions);
    } catch (error) {
      // TODO: Implement proper logging here (e.g., using a logger service)
      // logger.error('Erro ao buscar transações recentes:', error);
      res.status(500).json({ error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) });
    }
  }
}
