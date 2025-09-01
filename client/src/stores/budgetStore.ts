// budgetStore.ts - Store de orçamentos (Enterprise Level)
import { create } from 'zustand';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export interface Budget {
  id: string;
  name: string;
  description?: string;
  amount: number;
  spent: number;
  remaining: number;
  categoryId: string;
  category: string;
  period: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  userId: string;
  isActive: boolean;
  alertThreshold?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetFilters {
  period?: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  category?: string;
  isActive?: boolean;
  search?: string;
}

export interface BudgetState {
  budgets: Budget[];
  loading: boolean;
  isLoading: boolean; // Alias para loading
  error: string | null;
  filters: BudgetFilters;
  
  // Actions
  fetchBudgets: (filters?: BudgetFilters) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id' | 'spent' | 'remaining' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  removeBudget: (id: string) => Promise<void>; // Alias para deleteBudget
  setFilters: (filters: BudgetFilters) => void;
  clearError: () => void;
  setBudgets: (budgets: Budget[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  loading: false,
  isLoading: false, // Alias para loading
  error: null,
  filters: {},
  
  fetchBudgets: async (filters = {}) => {
    try {
      set({ loading: true, error: null });
      
      const queryParams = new URLSearchParams();
      
      // Aplicar filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
      
      const response = await api.get(`/budgets?${queryParams.toString()}`);
      const budgets = response.data.data || response.data;
      
      set({
        budgets,
        loading: false,
        filters,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar orçamentos';
      set({
        error: errorMessage,
        loading: false,
      });
      toast.error(errorMessage);
    }
  },
  
  addBudget: async (budgetData) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.post('/budgets', budgetData);
      const newBudget = response.data.data;
      
      set((state) => ({
        budgets: [newBudget, ...state.budgets],
        loading: false,
      }));
      
      toast.success('Orçamento criado com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar orçamento';
      set({
        error: errorMessage,
        loading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },
  
  updateBudget: async (id: string, updates: Partial<Budget>) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.put(`/budgets/${id}`, updates);
      const updatedBudget = response.data.data;
      
      set((state) => ({
        budgets: state.budgets.map((budget) =>
          budget.id === id ? updatedBudget : budget
        ),
        loading: false,
      }));
      
      toast.success('Orçamento atualizado com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar orçamento';
      set({
        error: errorMessage,
        loading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },
  
  deleteBudget: async (id: string) => {
    try {
      set({ loading: true, isLoading: true, error: null });
      
      await api.delete(`/budgets/${id}`);
      
      set((state) => ({
        budgets: state.budgets.filter((budget) => budget.id !== id),
        loading: false,
        isLoading: false,
      }));
      
      toast.success('Orçamento removido com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao remover orçamento';
      set({
        error: errorMessage,
        loading: false,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  // Alias para deleteBudget
  removeBudget: async (id: string) => {
    return get().deleteBudget(id);
  },
  
  setFilters: (filters: BudgetFilters) => {
    set({ filters });
  },
  
  clearError: () => {
    set({ error: null });
  },
  
  setBudgets: (budgets: Budget[]) => {
    set({ budgets });
  },
  
  setLoading: (loading: boolean) => {
    set({ loading });
  },
  
  setError: (error: string | null) => {
    set({ error });
  },
}));

// NOTE: Types are already exported above with export interface
