import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'yearly' | 'weekly';
  startDate: string;
  endDate: string;
  isActive: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  alertPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetState {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setBudgets: (budgets: Budget[]) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  removeBudget: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearBudgets: () => void;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, _get) => ({
      budgets: [],
      isLoading: false,
      error: null,

      setBudgets: budgets => set({ budgets, error: null }),

      addBudget: budget =>
        set(state => ({
          budgets: [budget, ...state.budgets],
          error: null,
        })),

      updateBudget: (id, updatedData) =>
        set(state => ({
          budgets: state.budgets.map(b => (b.id === id ? { ...b, ...updatedData } : b)),
          error: null,
        })),

      removeBudget: id =>
        set(state => ({
          budgets: state.budgets.filter(b => b.id !== id),
          error: null,
        })),

      setLoading: isLoading => set({ isLoading }),

      setError: error => set({ error, isLoading: false }),

      clearBudgets: () =>
        set({
          budgets: [],
          error: null,
        }),
    }),
    {
      name: 'budget-storage',
      partialize: state => ({
        budgets: state.budgets,
      }),
    }
  )
);