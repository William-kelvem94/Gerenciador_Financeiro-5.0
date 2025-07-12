import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense' | 'transfer';
  date: string;
  accountId: string;
  categoryId: string;
  account: {
    id: string;
    name: string;
    type: string;
    currency: string;
  };
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  type?: 'income' | 'expense' | 'transfer';
  accountId?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  
  // Actions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: Partial<TransactionState['pagination']>) => void;
  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },

      setTransactions: (transactions) => 
        set({ transactions, error: null }),

      addTransaction: (transaction) => 
        set((state) => ({ 
          transactions: [transaction, ...state.transactions],
          error: null,
        })),

      updateTransaction: (id, updatedData) => 
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updatedData } : t
          ),
          error: null,
        })),

      removeTransaction: (id) => 
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
          error: null,
        })),

      setLoading: (isLoading) => 
        set({ isLoading }),

      setError: (error) => 
        set({ error, isLoading: false }),

      setPagination: (pagination) => 
        set((state) => ({
          pagination: { ...state.pagination, ...pagination },
        })),

      clearTransactions: () => 
        set({ 
          transactions: [], 
          error: null, 
          pagination: { page: 1, limit: 10, total: 0, pages: 0 } 
        }),
    }),
    {
      name: 'transaction-storage',
      partialize: (state) => ({ 
        // Don't persist loading states and errors
        transactions: state.transactions,
        pagination: state.pagination,
      }),
    }
  )
);