// 🧪 useTransactions Hook Tests - Will Finance 5.0
// Enterprise-grade React hook testing

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTransactions } from '../../hooks/useTransactions';

// Mock dependencies
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

// Mock stores
const mockAuthStore = {
  user: {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    isActive: true,
  },
  isAuthenticated: true,
};

const mockTransactionStore = {
  transactions: [],
  loading: false,
  error: null,
  addTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  fetchTransactions: vi.fn(),
  getTransactionsByDateRange: vi.fn(),
  getTransactionsByCategory: vi.fn(),
};

vi.mock('../../stores/authStore', () => ({
  useAuthStore: () => mockAuthStore,
}));

vi.mock('../../stores/transactionStore', () => ({
  useTransactionStore: () => mockTransactionStore,
}));

describe('useTransactions Hook', () => {
  const mockTransactions = [
    {
      id: 'tx-1',
      description: 'Test Income',
      amount: 1000,
      type: 'INCOME' as const,
      category: 'Salary',
      categoryId: 'cat-1',
      date: '2025-01-01',
      userId: 'user-123',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    },
    {
      id: 'tx-2',
      description: 'Test Expense',
      amount: 500,
      type: 'EXPENSE' as const,
      category: 'Food',
      categoryId: 'cat-2',
      date: '2025-01-02',
      userId: 'user-123',
      createdAt: '2025-01-02T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockTransactionStore.transactions = mockTransactions;
    mockTransactionStore.loading = false;
    mockTransactionStore.error = null;
  });

  it('deve retornar dados iniciais corretamente', () => {
    const { result } = renderHook(() => useTransactions());

    expect(result.current.transactions).toEqual(mockTransactions);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.addTransaction).toBe('function');
    expect(typeof result.current.updateTransaction).toBe('function');
    expect(typeof result.current.deleteTransaction).toBe('function');
  });

  it('deve chamar addTransaction do store', async () => {
    const { result } = renderHook(() => useTransactions());
    
    const newTransaction = {
      description: 'New Transaction',
      amount: 200,
      type: 'EXPENSE' as const,
      category: 'Shopping',
      categoryId: 'cat-3',
      date: '2025-01-03',
    };

    await act(async () => {
      await result.current.addTransaction(newTransaction);
    });

    expect(mockTransactionStore.addTransaction).toHaveBeenCalledWith(newTransaction);
  });

  it('deve chamar updateTransaction do store', async () => {
    const { result } = renderHook(() => useTransactions());
    
    const updatedTransaction = {
      id: 'tx-1',
      description: 'Updated Transaction',
      amount: 1500,
      type: 'INCOME' as const,
      category: 'Salary',
      categoryId: 'cat-1',
      date: '2025-01-01',
    };

    await act(async () => {
      await result.current.updateTransaction('tx-1', updatedTransaction);
    });

    expect(mockTransactionStore.updateTransaction).toHaveBeenCalledWith('tx-1', updatedTransaction);
  });

  it('deve chamar deleteTransaction do store', async () => {
    const { result } = renderHook(() => useTransactions());

    await act(async () => {
      await result.current.deleteTransaction('tx-1');
    });

    expect(mockTransactionStore.deleteTransaction).toHaveBeenCalledWith('tx-1');
  });

  it('deve calcular estatísticas corretamente', () => {
    const { result } = renderHook(() => useTransactions());

    const stats = result.current.getStats();

    expect(stats.totalIncome).toBe(1000);
    expect(stats.totalExpenses).toBe(500);
    expect(stats.balance).toBe(500);
    expect(stats.transactionCount).toBe(2);
  });

  it('deve filtrar transações por tipo', () => {
    const { result } = renderHook(() => useTransactions());

    const incomeTransactions = result.current.getTransactionsByType('INCOME');
    const expenseTransactions = result.current.getTransactionsByType('EXPENSE');

    expect(incomeTransactions).toHaveLength(1);
    expect(incomeTransactions[0].type).toBe('INCOME');
    
    expect(expenseTransactions).toHaveLength(1);
    expect(expenseTransactions[0].type).toBe('EXPENSE');
  });

  it('deve lidar com estado de loading', () => {
    mockTransactionStore.loading = true;
    
    const { result } = renderHook(() => useTransactions());

    expect(result.current.loading).toBe(true);
  });

  it('deve lidar com estado de erro', () => {
    const errorMessage = 'Erro ao carregar transações';
    mockTransactionStore.error = errorMessage;
    
    const { result } = renderHook(() => useTransactions());

    expect(result.current.error).toBe(errorMessage);
  });

  it('deve buscar transações quando solicitado', async () => {
    const { result } = renderHook(() => useTransactions());

    await act(async () => {
      await result.current.fetchTransactions();
    });

    expect(mockTransactionStore.fetchTransactions).toHaveBeenCalled();
  });

  it('deve filtrar transações por categoria', () => {
    const { result } = renderHook(() => useTransactions());

    const salaryTransactions = result.current.getTransactionsByCategory('Salary');

    expect(salaryTransactions).toHaveLength(1);
    expect(salaryTransactions[0].category).toBe('Salary');
  });

  it('deve retornar transações recentes', () => {
    const { result } = renderHook(() => useTransactions());

    const recentTransactions = result.current.getRecentTransactions(1);

    expect(recentTransactions).toHaveLength(1);
    // Deve retornar a transação mais recente (by date)
    expect(recentTransactions[0].id).toBe('tx-2');
  });
});
