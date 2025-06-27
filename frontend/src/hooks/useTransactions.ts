import { useState, useEffect } from 'react';
import { Transaction, PaginatedResponse } from '../types/index.js';
import { transactionService } from '../services/api.js';

export const useTransactions = (page = 1, limit = 10, filters?: any) => {
  const [data, setData] = useState<PaginatedResponse<Transaction> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await transactionService.getTransactions(page, limit, filters);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar transações');
      console.error('Erro ao carregar transações:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTransaction = await transactionService.createTransaction(transaction);
      await fetchTransactions(); // Refresh the list
      return newTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar transação');
      throw err;
    }
  };

  const updateTransaction = async (id: number, transaction: Partial<Transaction>) => {
    try {
      const updatedTransaction = await transactionService.updateTransaction(id, transaction);
      await fetchTransactions(); // Refresh the list
      return updatedTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar transação');
      throw err;
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      await transactionService.deleteTransaction(id);
      await fetchTransactions(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar transação');
      throw err;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, limit, JSON.stringify(filters)]);

  return {
    data,
    loading,
    error,
    refresh: fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
