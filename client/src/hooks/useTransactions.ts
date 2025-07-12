import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { useTransactionStore, Transaction, TransactionFilters } from '../stores/transactionStore';

const API_BASE = 'http://localhost:8080/api';

interface CreateTransactionData {
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  type: 'income' | 'expense' | 'transfer';
  date: string;
}

interface UpdateTransactionData extends Partial<CreateTransactionData> {}

export const useTransactions = () => {
  const { token } = useAuthStore();
  const {
    transactions,
    isLoading,
    error,
    pagination,
    setTransactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
    setLoading,
    setError,
    setPagination,
  } = useTransactionStore();

  const getAuthHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }), [token]);

  const fetchTransactions = useCallback(async (filters: TransactionFilters = {}) => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.accountId) queryParams.append('accountId', filters.accountId);
      if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);

      const response = await fetch(
        `${API_BASE}/transactions?${queryParams.toString()}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.transactions);
      setPagination(data.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, getAuthHeaders, setTransactions, setPagination, setLoading, setError]);

  const createTransaction = useCallback(async (data: CreateTransactionData) => {
    if (!token) {
      toast.error('Authentication required');
      return null;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create transaction');
      }

      const newTransaction = await response.json();
      addTransaction(newTransaction);
      toast.success(newTransaction.message || 'Transaction created successfully');
      return newTransaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create transaction';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, getAuthHeaders, addTransaction, setLoading, setError]);

  const updateTransactionById = useCallback(async (id: string, data: UpdateTransactionData) => {
    if (!token) {
      toast.error('Authentication required');
      return null;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/transactions/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to update transaction');
      }

      const updatedTransaction = await response.json();
      updateTransaction(id, updatedTransaction);
      toast.success(updatedTransaction.message || 'Transaction updated successfully');
      return updatedTransaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update transaction';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, getAuthHeaders, updateTransaction, setLoading, setError]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (!token) {
      toast.error('Authentication required');
      return false;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/transactions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to delete transaction');
      }

      const result = await response.json();
      removeTransaction(id);
      toast.success(result.message || 'Transaction deleted successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transaction';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, getAuthHeaders, removeTransaction, setLoading, setError]);

  return {
    transactions,
    isLoading,
    error,
    pagination,
    fetchTransactions,
    createTransaction,
    updateTransaction: updateTransactionById,
    deleteTransaction,
  };
};