// useTransactions.ts - Hook otimizado para integração com TransactionStore
import { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { useTransactionStore, TransactionFilters, Transaction } from '../stores/transactionStore';

interface CreateTransactionData {
  accountId?: string;
  categoryId: string;
  category: string;
  amount: number;
  description: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  date: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

interface UpdateTransactionData extends Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>> {}

export const useTransactions = () => {
  const { user } = useAuthStore();
  const {
    transactions,
    isLoading,
    error,
    pagination,
    fetchTransactions: storeFetchTransactions,
    addTransaction: storeAddTransaction,
    updateTransaction: storeUpdateTransaction,
    deleteTransaction: storeDeleteTransaction,
  } = useTransactionStore();

  // Integração otimizada com store
  const fetchTransactions = useCallback(
    async (filters: TransactionFilters = {}) => {
      if (!user?.id) {
        toast.error('Usuário não autenticado');
        return;
      }
      
      try {
        await storeFetchTransactions(filters);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    },
    [user?.id, storeFetchTransactions]
  );

  const createTransaction = useCallback(
    async (data: CreateTransactionData): Promise<boolean> => {
      if (!user?.id) {
        toast.error('Usuário não autenticado');
        return false;
      }

      try {
        const transactionData = {
          ...data,
          userId: user.id,
        };

        await storeAddTransaction(transactionData);
        return true;
      } catch (error: any) {
        const errorMessage = error?.message || 'Falha ao criar transação';
        toast.error(errorMessage);
        return false;
      }
    },
    [user?.id, storeAddTransaction]
  );

  const updateTransaction = useCallback(
    async (id: string, data: UpdateTransactionData): Promise<boolean> => {
      if (!user?.id) {
        toast.error('Usuário não autenticado');
        return false;
      }

      try {
        await storeUpdateTransaction(id, data);
        return true;
      } catch (error: any) {
        const errorMessage = error?.message || 'Falha ao atualizar transação';
        toast.error(errorMessage);
        return false;
      }
    },
    [user?.id, storeUpdateTransaction]
  );

  const deleteTransaction = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user?.id) {
        toast.error('Usuário não autenticado');
        return false;
      }

      try {
        await storeDeleteTransaction(id);
        return true;
      } catch (error: any) {
        const errorMessage = error?.message || 'Falha ao deletar transação';
        toast.error(errorMessage);
        return false;
      }
    },
    [user?.id, storeDeleteTransaction]
  );

  // Calculados memoizados para performance
  const statistics = useMemo(() => {
    if (!transactions.length) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        transactionCount: 0,
      };
    }

    let totalIncome = 0;
    let totalExpense = 0;
    
    transactions.forEach(transaction => {
      if (transaction.type === 'INCOME') {
        totalIncome += transaction.amount;
      } else if (transaction.type === 'EXPENSE') {
        totalExpense += transaction.amount;
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  // Performance optimized return - same reference
  return {
    transactions,
    isLoading,
    error,
    pagination,
    statistics,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } as const;
};
