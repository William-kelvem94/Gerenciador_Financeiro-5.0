import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { useBudgetStore } from '../stores/budgetStore';

const API_BASE = 'http://localhost:8080/api';

interface CreateBudgetData {
  name: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
}

interface UpdateBudgetData extends Partial<CreateBudgetData> {
  isActive?: boolean;
}

export const useBudgets = () => {
  const { token } = useAuthStore();
  const {
    budgets,
    isLoading,
    error,
    setBudgets,
    addBudget,
    updateBudget,
    removeBudget,
    setLoading,
    setError,
  } = useBudgetStore();

  const getAuthHeaders = useCallback(
    () => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const fetchBudgets = useCallback(async () => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/budgets`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to fetch budgets');
      }

      const data = await response.json();
      setBudgets(data.budgets || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch budgets';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, getAuthHeaders, setBudgets, setLoading, setError]);

  const createBudget = useCallback(
    async (data: CreateBudgetData) => {
      if (!token) {
        toast.error('Authentication required');
        return null;
      }

      setLoading(true);

      try {
        const response = await fetch(`${API_BASE}/budgets`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || errorData.error || 'Failed to create budget');
        }

        const newBudget = await response.json();
        addBudget(newBudget);
        toast.success('Budget created successfully');
        return newBudget;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create budget';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, getAuthHeaders, addBudget, setLoading, setError]
  );

  const updateBudgetById = useCallback(
    async (id: string, data: UpdateBudgetData) => {
      if (!token) {
        toast.error('Authentication required');
        return null;
      }

      setLoading(true);

      try {
        const response = await fetch(`${API_BASE}/budgets/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || errorData.error || 'Failed to update budget');
        }

        const updatedBudget = await response.json();
        updateBudget(id, updatedBudget);
        toast.success('Budget updated successfully');
        return updatedBudget;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update budget';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, getAuthHeaders, updateBudget, setLoading, setError]
  );

  const deleteBudget = useCallback(
    async (id: string) => {
      if (!token) {
        toast.error('Authentication required');
        return false;
      }

      setLoading(true);

      try {
        const response = await fetch(`${API_BASE}/budgets/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || errorData.error || 'Failed to delete budget');
        }

        const result = await response.json();
        removeBudget(id);
        toast.success(result.message || 'Budget deleted successfully');
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete budget';
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, getAuthHeaders, removeBudget, setLoading, setError]
  );

  return {
    budgets,
    isLoading,
    error,
    fetchBudgets,
    createBudget,
    updateBudget: updateBudgetById,
    deleteBudget,
  };
};
