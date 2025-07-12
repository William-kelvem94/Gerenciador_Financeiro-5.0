import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  period: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetOverview {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  overBudgetCount: number;
  activeBudgets: number;
  totalBudgets: number;
  budgets: Budget[];
}

interface BudgetState {
  budgets: Budget[];
  overview: BudgetOverview | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBudgets: () => Promise<void>;
  fetchOverview: () => Promise<void>;
  createBudget: (budget: Omit<Budget, 'id' | 'spent' | 'remaining' | 'percentageUsed' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useBudgetStore = create<BudgetState>()(
  devtools(
    (set, get) => ({
      budgets: [],
      overview: null,
      isLoading: false,
      error: null,

      fetchBudgets: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await api.get('/budgets');
          
          set({
            budgets: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || 'Failed to fetch budgets';
          set({
            error: message,
            isLoading: false,
          });
          toast.error(message);
        }
      },

      fetchOverview: async () => {
        try {
          const response = await api.get('/budgets/overview');
          set({ overview: response.data });
        } catch (error: any) {
          console.error('Failed to fetch budget overview:', error);
        }
      },

      createBudget: async (budgetData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await api.post('/budgets', budgetData);
          const newBudget = response.data;

          set(state => ({
            budgets: [newBudget, ...state.budgets],
            isLoading: false,
          }));

          // Refresh overview
          get().fetchOverview();
          
          toast.success('Budget created successfully');
        } catch (error: any) {
          const message = error.response?.data?.message || 'Failed to create budget';
          set({
            error: message,
            isLoading: false,
          });
          toast.error(message);
          throw error;
        }
      },

      updateBudget: async (id, budgetData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await api.patch(`/budgets/${id}`, budgetData);
          const updatedBudget = response.data;

          set(state => ({
            budgets: state.budgets.map(b => 
              b.id === id ? updatedBudget : b
            ),
            isLoading: false,
          }));

          // Refresh overview
          get().fetchOverview();
          
          toast.success('Budget updated successfully');
        } catch (error: any) {
          const message = error.response?.data?.message || 'Failed to update budget';
          set({
            error: message,
            isLoading: false,
          });
          toast.error(message);
          throw error;
        }
      },

      deleteBudget: async (id) => {
        try {
          set({ isLoading: true, error: null });
          
          await api.delete(`/budgets/${id}`);

          set(state => ({
            budgets: state.budgets.filter(b => b.id !== id),
            isLoading: false,
          }));

          // Refresh overview
          get().fetchOverview();
          
          toast.success('Budget deleted successfully');
        } catch (error: any) {
          const message = error.response?.data?.message || 'Failed to delete budget';
          set({
            error: message,
            isLoading: false,
          });
          toast.error(message);
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    { name: 'budget-store' }
  )
);