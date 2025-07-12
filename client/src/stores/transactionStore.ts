import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense' | 'transfer';
  date: string;
  createdAt: string;
  updatedAt: string;
  account: {
    id: string;
    name: string;
    type: string;
  };
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

export interface TransactionFilters {
  type?: string;
  categoryId?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface TransactionStatistics {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

interface TransactionState {
  transactions: Transaction[];
  statistics: TransactionStatistics | null;
  isLoading: boolean;
  error: string | null;
  filters: TransactionFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  fetchTransactions: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  createTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'account' | 'category'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setFilters: (filters: Partial<TransactionFilters>) => void;
  clearError: () => void;
}

export const useTransactionStore = create<TransactionState>()(
  devtools(
    (set, get) => ({
      transactions: [],
      statistics: null,
      isLoading: false,
      error: null,
      filters: {
        page: 1,
        limit: 10,
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },

      fetchTransactions: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const { filters } = get();
          const params = new URLSearchParams();
          
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              params.append(key, String(value));
            }
          });

          const response = await api.get(`/transactions?${params.toString()}`);
          const { data, pagination } = response.data;

          set({
            transactions: data,
            pagination,
            isLoading: false,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || 'Failed to fetch transactions';
          set({
            error: message,
            isLoading: false,
          });
          toast.error(message);
        }
      },

      fetchStatistics: async () => {
        try {
          const response = await api.get('/transactions/statistics');
          set({ statistics: response.data });
        } catch (error: any) {
          console.error('Failed to fetch statistics:', error);
        }
      },

      createTransaction: async (transactionData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await api.post('/transactions', transactionData);
          const newTransaction = response.data;

          set(state => ({
            transactions: [newTransaction, ...state.transactions],
            isLoading: false,
          }));

          // Refresh statistics
          get().fetchStatistics();
          
          toast.success('Transaction created successfully');
        } catch (error: any) {
          const message = error.response?.data?.message || 'Failed to create transaction';
          set({
            error: message,
            isLoading: false,
          });
          toast.error(message);
          throw error;
        }
      },

      updateTransaction: async (id, transactionData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await api.patch(`/transactions/${id}`, transactionData);
          const updatedTransaction = response.data;

          set(state => ({
            transactions: state.transactions.map(t => 
              t.id === id ? updatedTransaction : t
            ),
            isLoading: false,
          }));

          // Refresh statistics
          get().fetchStatistics();
          
          toast.success('Transaction updated successfully');
        } catch (error: any) {
          const message = error.response?.data?.message || 'Failed to update transaction';
          set({
            error: message,
            isLoading: false,
          });
          toast.error(message);
          throw error;
        }
      },

      deleteTransaction: async (id) => {
        try {
          set({ isLoading: true, error: null });
          
          await api.delete(`/transactions/${id}`);

          set(state => ({
            transactions: state.transactions.filter(t => t.id !== id),
            isLoading: false,
          }));

          // Refresh statistics
          get().fetchStatistics();
          
          toast.success('Transaction deleted successfully');
        } catch (error: any) {
          const message = error.response?.data?.message || 'Failed to delete transaction';
          set({
            error: message,
            isLoading: false,
          });
          toast.error(message);
          throw error;
        }
      },

      setFilters: (newFilters) => {
        set(state => ({
          filters: { ...state.filters, ...newFilters },
        }));
        
        // Automatically fetch transactions with new filters
        setTimeout(() => get().fetchTransactions(), 0);
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    { name: 'transaction-store' }
  )
);