// transactionStore.ts - Store de transações (Enterprise Level)
import { create } from 'zustand';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  category: string;
  categoryId: string;
  date: string;
  userId: string;
  accountId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  category?: string;
  categoryId?: string; // Nova propriedade
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  accountId?: string; // Nova propriedade
  page?: number; // Nova propriedade
  limit?: number; // Nova propriedade
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  isLoading: boolean; // Alias para loading (para compatibilidade)
  error: string | null;
  pagination: PaginationMeta | null;
  filters: TransactionFilters;
  
  // Actions
  fetchTransactions: (filters?: TransactionFilters, page?: number) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>; // Alias para deleteTransaction
  setFilters: (filters: TransactionFilters) => void;
  clearError: () => void;
  setTransactions: (transactions: Transaction[]) => void;
  setPagination: (pagination: PaginationMeta) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  loading: false,
  isLoading: false, // Alias para loading
  error: null,
  pagination: null,
  filters: {},
  
  fetchTransactions: async (filters = {}, page = 1) => {
    try {
      set({ loading: true, isLoading: true, error: null });
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', '20');
      
      // Aplicar filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
      
      const response = await api.get(`/transactions?${queryParams.toString()}`);
      const { data, pagination } = response.data;
      
      set({
        transactions: data,
        pagination,
        loading: false,
        isLoading: false,
        filters,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar transações';
      set({
        error: errorMessage,
        loading: false,
      });
      toast.error(errorMessage);
    }
  },
  
  addTransaction: async (transactionData) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.post('/transactions', transactionData);
      const newTransaction = response.data.data;
      
      set((state) => ({
        transactions: [newTransaction, ...state.transactions],
        loading: false,
      }));
      
      toast.success('Transação adicionada com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao adicionar transação';
      set({
        error: errorMessage,
        loading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },
  
  updateTransaction: async (id: string, updates: Partial<Transaction>) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.put(`/transactions/${id}`, updates);
      const updatedTransaction = response.data.data;
      
      set((state) => ({
        transactions: state.transactions.map((tx) =>
          tx.id === id ? updatedTransaction : tx
        ),
        loading: false,
      }));
      
      toast.success('Transação atualizada com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar transação';
      set({
        error: errorMessage,
        loading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },
  
  deleteTransaction: async (id: string) => {
    try {
      set({ loading: true, isLoading: true, error: null });
      
      await api.delete(`/transactions/${id}`);
      
      set((state) => ({
        transactions: state.transactions.filter((tx) => tx.id !== id),
        loading: false,
        isLoading: false,
      }));
      
      toast.success('Transação removida com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao remover transação';
      set({
        error: errorMessage,
        loading: false,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  // Alias para deleteTransaction
  removeTransaction: async (id: string) => {
    return get().deleteTransaction(id);
  },
  
  setFilters: (filters: TransactionFilters) => {
    set({ filters });
  },
  
  clearError: () => {
    set({ error: null });
  },
  
  setTransactions: (transactions: Transaction[]) => {
    set({ transactions });
  },
  
  setPagination: (pagination: PaginationMeta) => {
    set({ pagination });
  },
  
  setLoading: (loading: boolean) => {
    set({ loading });
  },
  
  setError: (error: string | null) => {
    set({ error });
  },
}));

// NOTE: Types are already exported above with export interface
