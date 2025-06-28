import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { apiService } from '../services/api.service';
import { useAuthStore } from '../store/authStore';
import { Transaction, Account, Category } from '../types/api.types';
import { toast } from 'react-hot-toast';

// Tipos
interface FinanceContextData {
  // State
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  
  // Dashboard data
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  
  // Actions
  fetchTransactions: (params?: TransactionFilters) => Promise<void>;
  createTransaction: (data: CreateTransactionData) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  fetchAccounts: () => Promise<void>;
  createAccount: (data: CreateAccountData) => Promise<void>;
  updateAccount: (id: string, data: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  
  fetchCategories: () => Promise<void>;
  createCategory: (data: CreateCategoryData) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  refreshDashboard: () => Promise<void>;
  clearError: () => void;
}

interface TransactionFilters {
  page?: number;
  limit?: number;
  accountId?: string;
  categoryId?: string;
  type?: 'income' | 'expense' | 'transfer';
  startDate?: string;
  endDate?: string;
}

interface CreateTransactionData {
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  type: 'income' | 'expense' | 'transfer';
  date: Date;
}

interface CreateAccountData {
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'INVESTMENT' | 'CASH' | 'LOAN' | 'OTHER';
  balance: number;
  currency: string;
  description?: string;
  color: string;
  icon?: string;
  bankName?: string;
  isActive: boolean;
}

interface CreateCategoryData {
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
}

const FinanceContext = createContext<FinanceContextData | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dashboard data
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  // Error handling
  const handleError = useCallback((error: any, defaultMessage: string) => {
    const message = error instanceof Error ? error.message : defaultMessage;
    setError(message);
    console.error(defaultMessage, error);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Transactions
  const fetchTransactions = useCallback(async (filters?: TransactionFilters) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await apiService.getTransactions(filters);
      setTransactions(response.data.transactions);
    } catch (error) {
      handleError(error, 'Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, handleError]);

  const createTransaction = useCallback(async (data: CreateTransactionData) => {
    try {
      setLoading(true);
      await apiService.createTransaction(data);
      toast.success('Transação criada com sucesso!');
      await fetchTransactions();
      await refreshDashboard();
    } catch (error) {
      handleError(error, 'Erro ao criar transação');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, handleError]);

  const updateTransaction = useCallback(async (id: string, data: Partial<Transaction>) => {
    try {
      setLoading(true);
      await apiService.updateTransaction(id, data);
      toast.success('Transação atualizada com sucesso!');
      await fetchTransactions();
      await refreshDashboard();
    } catch (error) {
      handleError(error, 'Erro ao atualizar transação');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, handleError]);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await apiService.deleteTransaction(id);
      toast.success('Transação deletada com sucesso!');
      await fetchTransactions();
      await refreshDashboard();
    } catch (error) {
      handleError(error, 'Erro ao deletar transação');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, handleError]);

  // Accounts
  const fetchAccounts = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await apiService.getAccounts();
      setAccounts(response.data.accounts);
    } catch (error) {
      handleError(error, 'Erro ao carregar contas');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, handleError]);

  const createAccount = useCallback(async (data: CreateAccountData) => {
    try {
      setLoading(true);
      await apiService.createAccount(data);
      toast.success('Conta criada com sucesso!');
      await fetchAccounts();
      await refreshDashboard();
    } catch (error) {
      handleError(error, 'Erro ao criar conta');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchAccounts, handleError]);

  const updateAccount = useCallback(async (id: string, data: Partial<Account>) => {
    try {
      setLoading(true);
      await apiService.updateAccount(id, data);
      toast.success('Conta atualizada com sucesso!');
      await fetchAccounts();
      await refreshDashboard();
    } catch (error) {
      handleError(error, 'Erro ao atualizar conta');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchAccounts, handleError]);

  const deleteAccount = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await apiService.deleteAccount(id);
      toast.success('Conta deletada com sucesso!');
      await fetchAccounts();
      await refreshDashboard();
    } catch (error) {
      handleError(error, 'Erro ao deletar conta');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchAccounts, handleError]);

  // Categories
  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await apiService.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      handleError(error, 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, handleError]);

  const createCategory = useCallback(async (data: CreateCategoryData) => {
    try {
      setLoading(true);
      await apiService.createCategory(data);
      toast.success('Categoria criada com sucesso!');
      await fetchCategories();
    } catch (error) {
      handleError(error, 'Erro ao criar categoria');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, handleError]);

  const updateCategory = useCallback(async (id: string, data: Partial<Category>) => {
    try {
      setLoading(true);
      await apiService.updateCategory(id, data);
      toast.success('Categoria atualizada com sucesso!');
      await fetchCategories();
    } catch (error) {
      handleError(error, 'Erro ao atualizar categoria');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, handleError]);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await apiService.deleteCategory(id);
      toast.success('Categoria deletada com sucesso!');
      await fetchCategories();
    } catch (error) {
      handleError(error, 'Erro ao deletar categoria');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, handleError]);

  // Dashboard
  const refreshDashboard = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await apiService.getDashboardData();
      const { totalBalance: balance, monthlyIncome: income, monthlyExpenses: expenses } = response.data;
      
      setTotalBalance(balance);
      setMonthlyIncome(income);
      setMonthlyExpenses(expenses);
    } catch (error) {
      handleError(error, 'Erro ao carregar dados do dashboard');
    }
  }, [isAuthenticated, handleError]);

  // Initial data load
  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
      fetchAccounts();
      fetchCategories();
      refreshDashboard();
    } else {
      // Clear data when user logs out
      setTransactions([]);
      setAccounts([]);
      setCategories([]);
      setTotalBalance(0);
      setMonthlyIncome(0);
      setMonthlyExpenses(0);
      setError(null);
    }
  }, [isAuthenticated, fetchTransactions, fetchAccounts, fetchCategories, refreshDashboard]);

  const value: FinanceContextData = useMemo(() => ({
    // State
    transactions,
    accounts,
    categories,
    loading,
    error,
    
    // Dashboard data
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    
    // Actions
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    
    refreshDashboard,
    clearError,
  }), [
    transactions,
    accounts,
    categories,
    loading,
    error,
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshDashboard,
    clearError,
  ]);

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance(): FinanceContextData {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
