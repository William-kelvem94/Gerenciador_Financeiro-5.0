// useBudgets.ts - Hook otimizado para integração com BudgetStore
import { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { useBudgetStore, Budget } from '../stores/budgetStore';

interface CreateBudgetData {
  name: string;
  amount: number;
  period: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  categoryId: string;
  category: string;
  startDate: string;
  endDate: string;
  description?: string;
  alertThreshold?: number;
}

interface UpdateBudgetData extends Partial<Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'spent' | 'remaining'>> {}

interface BudgetFilters {
  period?: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  category?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export const useBudgets = () => {
  const { user } = useAuthStore();
  const {
    budgets,
    isLoading,
    error,
    fetchBudgets: storeFetchBudgets,
    addBudget: storeAddBudget,
    updateBudget: storeUpdateBudget,
    deleteBudget: storeDeleteBudget,
  } = useBudgetStore();

  // Integração otimizada com store
  const fetchBudgets = useCallback(
    async (filters: BudgetFilters = {}) => {
      if (!user?.id) {
        toast.error('Usuário não autenticado');
        return;
      }
      
      try {
        await storeFetchBudgets(filters);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    },
    [user?.id, storeFetchBudgets]
  );

  const createBudget = useCallback(
    async (data: CreateBudgetData): Promise<boolean> => {
      if (!user?.id) {
        toast.error('Usuário não autenticado');
        return false;
      }

      try {
        const budgetData = {
          ...data,
          userId: user.id,
          isActive: true,
          spent: 0,
          remaining: data.amount,
        };

        await storeAddBudget(budgetData);
        return true;
      } catch (error: any) {
        const errorMessage = error?.message || 'Falha ao criar orçamento';
        toast.error(errorMessage);
        return false;
      }
    },
    [user?.id, storeAddBudget]
  );

  const updateBudget = useCallback(
    async (id: string, data: UpdateBudgetData): Promise<boolean> => {
      if (!user?.id) {
        toast.error('Usuário não autenticado');
        return false;
      }

      try {
        await storeUpdateBudget(id, data);
        return true;
      } catch (error: any) {
        const errorMessage = error?.message || 'Falha ao atualizar orçamento';
        toast.error(errorMessage);
        return false;
      }
    },
    [user?.id, storeUpdateBudget]
  );

  const deleteBudget = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user?.id) {
        toast.error('Usuário não autenticado');
        return false;
      }

      try {
        await storeDeleteBudget(id);
        return true;
      } catch (error: any) {
        const errorMessage = error?.message || 'Falha ao deletar orçamento';
        toast.error(errorMessage);
        return false;
      }
    },
    [user?.id, storeDeleteBudget]
  );

  // Calculados memoizados para performance
  const statistics = useMemo(() => {
    const activeBudgets = budgets.filter((budget) => budget.isActive);
    const totalBudgetAmount = activeBudgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = activeBudgets.reduce((sum, budget) => sum + budget.spent, 0);
    const totalRemaining = activeBudgets.reduce((sum, budget) => sum + budget.remaining, 0);

    // Calculado de utilização por categoria
    const categoryUsage = activeBudgets.reduce((acc, budget) => {
      const usagePercentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
      acc[budget.category] = {
        used: budget.spent,
        total: budget.amount,
        percentage: usagePercentage,
        status: usagePercentage >= 90 ? 'critical' : usagePercentage >= 75 ? 'warning' : 'good'
      };
      return acc;
    }, {} as Record<string, any>);

    return {
      activeBudgets,
      totalBudgetAmount,
      totalSpent,
      totalRemaining,
      utilizationPercentage: totalBudgetAmount > 0 ? (totalSpent / totalBudgetAmount) * 100 : 0,
      categoryUsage,
      overbudgetCount: activeBudgets.filter(b => b.spent > b.amount).length,
    };
  }, [budgets]);

  // Performance optimized return
  return {
    budgets,
    isLoading,
    error,
    statistics,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
  } as const;
};
