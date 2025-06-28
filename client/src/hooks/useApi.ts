import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export function useTransactions(params?: {
  page?: number;
  limit?: number;
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getTransactions(params);
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar transações');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [JSON.stringify(params)]);

  const createTransaction = async (transactionData: any) => {
    const response = await apiService.createTransaction(transactionData);
    await fetchTransactions();
    return response;
  };

  const updateTransaction = async (id: string, transactionData: any) => {
    const response = await apiService.updateTransaction(id, transactionData);
    await fetchTransactions();
    return response;
  };

  const deleteTransaction = async (id: string) => {
    await apiService.deleteTransaction(id);
    await fetchTransactions();
  };

  return {
    transactions: data,
    loading,
    error,
    pagination,
    refresh: fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}

export function useAccounts() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAccounts();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar contas');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const createAccount = async (accountData: any) => {
    const response = await apiService.createAccount(accountData);
    await fetchAccounts();
    return response;
  };

  const updateAccount = async (id: string, accountData: any) => {
    const response = await apiService.updateAccount(id, accountData);
    await fetchAccounts();
    return response;
  };

  const deleteAccount = async (id: string) => {
    await apiService.deleteAccount(id);
    await fetchAccounts();
  };

  return {
    accounts: data,
    loading,
    error,
    refresh: fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  };
}

export function useBudgets() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBudgets();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar orçamentos');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const createBudget = async (budgetData: any) => {
    const response = await apiService.createBudget(budgetData);
    await fetchBudgets();
    return response;
  };

  const updateBudget = async (id: string, budgetData: any) => {
    const response = await apiService.updateBudget(id, budgetData);
    await fetchBudgets();
    return response;
  };

  const deleteBudget = async (id: string) => {
    await apiService.deleteBudget(id);
    await fetchBudgets();
  };

  return {
    budgets: data,
    loading,
    error,
    refresh: fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
  };
}

export function useGoals() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getGoals();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar metas');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const createGoal = async (goalData: any) => {
    const response = await apiService.createGoal(goalData);
    await fetchGoals();
    return response;
  };

  const updateGoal = async (id: string, goalData: any) => {
    const response = await apiService.updateGoal(id, goalData);
    await fetchGoals();
    return response;
  };

  const deleteGoal = async (id: string) => {
    await apiService.deleteGoal(id);
    await fetchGoals();
  };

  return {
    goals: data,
    loading,
    error,
    refresh: fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
  };
}

export function useCategories() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCategories();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories: data,
    loading,
    error,
    refresh: fetchCategories,
  };
}

export function useAnalytics(params?: {
  dateFrom?: string;
  dateTo?: string;
  groupBy?: string;
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAnalytics(params);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar analytics');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [JSON.stringify(params)]);

  return {
    analytics: data,
    loading,
    error,
    refresh: fetchAnalytics,
  };
}

export function useNotifications() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getNotifications();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar notificações');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    await apiService.markNotificationAsRead(id);
    await fetchNotifications();
  };

  const deleteNotification = async (id: string) => {
    await apiService.deleteNotification(id);
    await fetchNotifications();
  };

  return {
    notifications: data,
    loading,
    error,
    refresh: fetchNotifications,
    markAsRead,
    deleteNotification,
  };
}
