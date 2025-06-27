/**
 * Serviço para gerenciar modos de dados (real vs fictício)
 */

import { prisma } from '@/config/database';

export type DataMode = 'REAL' | 'DEMO' | 'TEST';

export interface DataModeConfig {
  mode: DataMode;
  userId: string;
  enabled: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

class DataModeService {
  /**
   * Obter modo atual do usuário
   */
  async getUserDataMode(userId: string): Promise<DataMode> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { theme: true } // Usar o campo theme temporariamente para armazenar o modo
      });
      
      // Por enquanto, todos os usuários começam no modo REAL
      return 'REAL';
    } catch (error) {
      console.error('Erro ao obter modo de dados:', error);
      return 'REAL';
    }
  }

  /**
   * Definir modo de dados do usuário
   */
  async setUserDataMode(userId: string, mode: DataMode): Promise<boolean> {
    try {
      // Por enquanto, apenas log do modo desejado
      console.log(`Definindo modo ${mode} para usuário ${userId}`);
      return true;
    } catch (error) {
      console.error('Erro ao definir modo de dados:', error);
      return false;
    }
  }

  /**
   * Limpar dados fictícios do usuário
   */
  async clearFictionalData(userId: string): Promise<boolean> {
    try {
      // Identificar e remover dados fictícios
      // (dados criados com descrições específicas ou categorias de teste)
      
      // Remover transações de demo
      await prisma.transaction.deleteMany({
        where: {
          userId,
          OR: [
            { description: { contains: 'Demo' } },
            { description: { contains: 'Teste' } },
            { description: { contains: 'Sample' } },
            { description: { contains: 'Exemplo' } },
            { description: { startsWith: 'Transação' } }
          ]
        }
      });

      // Remover categorias de demo
      await prisma.category.deleteMany({
        where: {
          userId,
          OR: [
            { name: { contains: 'Demo' } },
            { name: { contains: 'Teste' } },
            { name: { contains: 'Sample' } },
            { description: { contains: 'demonstração' } },
            { description: { contains: 'exemplo' } }
          ]
        }
      });

      // Remover contas de demo
      await prisma.account.deleteMany({
        where: {
          userId,
          OR: [
            { name: { contains: 'Demo' } },
            { name: { contains: 'Teste' } },
            { name: { contains: 'Sample' } },
            { description: { contains: 'demonstração' } },
            { description: { contains: 'exemplo' } }
          ]
        }
      });

      return true;
    } catch (error) {
      console.error('Erro ao limpar dados fictícios:', error);
      return false;
    }
  }

  /**
   * Criar dados de demonstração
   */
  async createDemoData(userId: string): Promise<boolean> {
    try {
      // Criar conta demo
      const demoAccount = await prisma.account.create({
        data: {
          userId,
          name: 'Conta Demo',
          description: 'Conta de demonstração - dados fictícios',
          type: 'CHECKING',
          balance: 5000.00
        }
      });

      // Criar categorias demo
      const demoCategories = [
        { name: 'Alimentação Demo', type: 'EXPENSE' as const, color: '#EF4444', icon: 'utensils' },
        { name: 'Transporte Demo', type: 'EXPENSE' as const, color: '#F59E0B', icon: 'car' },
        { name: 'Salário Demo', type: 'INCOME' as const, color: '#10B981', icon: 'dollar-sign' },
        { name: 'Lazer Demo', type: 'EXPENSE' as const, color: '#8B5CF6', icon: 'smile' }
      ];

      const createdCategories = await Promise.all(
        demoCategories.map(cat => 
          prisma.category.create({
            data: {
              userId,
              name: cat.name,
              type: cat.type,
              color: cat.color,
              icon: cat.icon,
              description: 'Categoria de demonstração - dados fictícios'
            }
          })
        )
      );

      // Criar transações demo
      const demoTransactions = [
        { description: 'Salário Demo', amount: 3000, type: 'INCOME' as const, categoryId: createdCategories[2].id },
        { description: 'Supermercado Demo', amount: -150, type: 'EXPENSE' as const, categoryId: createdCategories[0].id },
        { description: 'Uber Demo', amount: -25, type: 'EXPENSE' as const, categoryId: createdCategories[1].id },
        { description: 'Cinema Demo', amount: -45, type: 'EXPENSE' as const, categoryId: createdCategories[3].id },
        { description: 'Restaurante Demo', amount: -80, type: 'EXPENSE' as const, categoryId: createdCategories[0].id }
      ];

      await Promise.all(
        demoTransactions.map((trans, index) => 
          prisma.transaction.create({
            data: {
              userId,
              description: trans.description,
              amount: Math.abs(trans.amount),
              type: trans.type,
              date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)), // Últimos 5 dias
              categoryId: trans.categoryId,
              accountId: demoAccount.id
            }
          })
        )
      );

      return true;
    } catch (error) {
      console.error('Erro ao criar dados demo:', error);
      return false;
    }
  }

  /**
   * Verificar se usuário tem dados reais
   */
  async hasRealData(userId: string): Promise<boolean> {
    try {
      const realTransactionsCount = await prisma.transaction.count({
        where: {
          userId,
          NOT: {
            OR: [
              { description: { contains: 'Demo' } },
              { description: { contains: 'Teste' } },
              { description: { contains: 'Sample' } },
              { description: { contains: 'Exemplo' } },
              { description: { startsWith: 'Transação' } }
            ]
          }
        }
      });

      return realTransactionsCount > 0;
    } catch (error) {
      console.error('Erro ao verificar dados reais:', error);
      return false;
    }
  }

  /**
   * Estatísticas de dados
   */
  async getDataStats(userId: string) {
    try {
      const [realTransactions, demoTransactions, totalAccounts, totalCategories] = await Promise.all([
        prisma.transaction.count({
          where: {
            userId,
            NOT: {
              OR: [
                { description: { contains: 'Demo' } },
                { description: { contains: 'Teste' } },
                { description: { contains: 'Sample' } }
              ]
            }
          }
        }),
        prisma.transaction.count({
          where: {
            userId,
            OR: [
              { description: { contains: 'Demo' } },
              { description: { contains: 'Teste' } },
              { description: { contains: 'Sample' } }
            ]
          }
        }),
        prisma.account.count({ where: { userId } }),
        prisma.category.count({ where: { userId } })
      ]);

      return {
        realTransactions,
        demoTransactions,
        totalTransactions: realTransactions + demoTransactions,
        totalAccounts,
        totalCategories,
        hasRealData: realTransactions > 0,
        hasDemoData: demoTransactions > 0
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return {
        realTransactions: 0,
        demoTransactions: 0,
        totalTransactions: 0,
        totalAccounts: 0,
        totalCategories: 0,
        hasRealData: false,
        hasDemoData: false
      };
    }
  }
}

export const dataModeService = new DataModeService();
