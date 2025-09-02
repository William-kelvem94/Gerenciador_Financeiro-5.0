// 🧪 useTransactions Hook Tests - Will Finance 5.0
// Enterprise-grade React hook testing

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock data
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User'
};

const mockTransactions = [
  {
    id: 'tx-1',
    description: 'Test transaction 1',
    amount: 100,
    type: 'EXPENSE' as const,
    category: 'Food',
    date: '2025-01-01',
    userId: 'user-123',
    tags: [],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'tx-2',
    description: 'Test transaction 2',
    amount: 200,
    type: 'INCOME' as const,
    category: 'Salary',
    date: '2025-01-01',
    userId: 'user-123',
    tags: [],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  }
];

// Mock store actions
const mockStoreActions = {
  transactions: mockTransactions,
  isLoading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 2, pages: 1 },
  fetchTransactions: vi.fn(),
  addTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  setTransactions: vi.fn(),
  setLoading: vi.fn(),
  setError: vi.fn()
};

// Mock the stores BEFORE importing anything
vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({ user: mockUser }))
}));

vi.mock('../../stores/transactionStore', () => ({
  useTransactionStore: vi.fn(() => mockStoreActions)
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  }
}));

// Import after mocking
import { renderHook, act } from '@testing-library/react';
import { useTransactions } from '../../hooks/useTransactions';
import * as authStore from '../../stores/authStore';
import * as transactionStore from '../../stores/transactionStore';
import toast from 'react-hot-toast';

describe('useTransactions Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar dados iniciais corretamente', () => {
    const { result } = renderHook(() => useTransactions());

    expect(result.current.transactions).toEqual(mockTransactions);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.createTransaction).toBe('function');
    expect(typeof result.current.updateTransaction).toBe('function');
    expect(typeof result.current.deleteTransaction).toBe('function');
    expect(typeof result.current.fetchTransactions).toBe('function');
  });

  it('deve chamar createTransaction do store', async () => {
    const { result } = renderHook(() => useTransactions());

    const newTransaction = {
      description: 'New Transaction',
      amount: 200,
      type: 'EXPENSE' as const,
      category: 'Shopping',
      categoryId: 'cat-3',
      date: '2025-01-03',
    };

    mockStoreActions.addTransaction.mockResolvedValue(undefined);

    const success = await act(async () => {
      return await result.current.createTransaction(newTransaction);
    });

    expect(mockStoreActions.addTransaction).toHaveBeenCalledWith({
      ...newTransaction,
      userId: 'user-123',
    });
    expect(success).toBe(true);
  });

  it('deve chamar updateTransaction do store', async () => {
    const { result } = renderHook(() => useTransactions());

    const updatedTransaction = {
      description: 'Updated Transaction',
      amount: 1500,
      type: 'INCOME' as const,
      category: 'Salary',
      categoryId: 'cat-1',
      date: '2025-01-01',
    };

    mockStoreActions.updateTransaction.mockResolvedValue(undefined);

    const success = await act(async () => {
      return await result.current.updateTransaction('tx-1', updatedTransaction);
    });

    expect(mockStoreActions.updateTransaction).toHaveBeenCalledWith('tx-1', updatedTransaction);
    expect(success).toBe(true);
  });

  it('deve chamar deleteTransaction do store', async () => {
    const { result } = renderHook(() => useTransactions());

    mockStoreActions.deleteTransaction.mockResolvedValue(undefined);

    const success = await act(async () => {
      return await result.current.deleteTransaction('tx-1');
    });

    expect(mockStoreActions.deleteTransaction).toHaveBeenCalledWith('tx-1');
    expect(success).toBe(true);
  });

  it('deve calcular estatísticas corretamente', () => {
    const { result } = renderHook(() => useTransactions());

    const stats = result.current.statistics;

    expect(stats.totalIncome).toBe(5000);
    expect(stats.totalExpense).toBe(150);
    expect(stats.balance).toBe(4850);
    expect(stats.transactionCount).toBe(2);
  });

  it('deve filtrar transações por tipo', () => {
    const { result } = renderHook(() => useTransactions());

    const incomeTransactions = result.current.transactions.filter(tx => tx.type === 'INCOME');
    const expenseTransactions = result.current.transactions.filter(tx => tx.type === 'EXPENSE');

    expect(incomeTransactions).toHaveLength(1);
    expect(incomeTransactions[0].type).toBe('INCOME');

    expect(expenseTransactions).toHaveLength(1);
    expect(expenseTransactions[0].type).toBe('EXPENSE');
  });

  it('deve lidar com estado de loading', () => {
    mockStoreActions.isLoading = true;

    const { result } = renderHook(() => useTransactions());

    expect(result.current.isLoading).toBe(true);
  });

  it('deve lidar com estado de erro', () => {
    const errorMessage = 'Erro ao carregar transações';
    mockStoreActions.error = errorMessage;

    const { result } = renderHook(() => useTransactions());

    expect(result.current.error).toBe(errorMessage);
  });

  it('deve buscar transações quando solicitado', async () => {
    const { result } = renderHook(() => useTransactions());

    mockStoreActions.fetchTransactions.mockResolvedValue(undefined);

    await act(async () => {
      await result.current.fetchTransactions();
    });

    expect(mockStoreActions.fetchTransactions).toHaveBeenCalled();
  });

  it('deve filtrar transações por categoria', () => {
    const { result } = renderHook(() => useTransactions());

    const salaryTransactions = result.current.transactions.filter(tx => tx.category === 'Salário');

    expect(salaryTransactions).toHaveLength(1);
    expect(salaryTransactions[0].category).toBe('Salário');
  });

  it('deve retornar transações recentes', () => {
    const { result } = renderHook(() => useTransactions());

    const recentTransactions = result.current.transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 1);

    expect(recentTransactions).toHaveLength(1);
    // Deve retornar a transação mais recente (by date)
    expect(recentTransactions[0].id).toBe('tx-2');
  });

  it('deve retornar false quando usuário não está autenticado', async () => {
    // Temporariamente alterar o mock do authStore
    const originalUser = mockUser;
    (authStore.useAuthStore as unknown as vi.Mock).mockReturnValueOnce({ user: null });

    const { result } = renderHook(() => useTransactions());

    const success = await act(async () => {
      return await result.current.createTransaction({
        description: 'Test',
        amount: 100,
        type: 'EXPENSE',
        category: 'Test',
        categoryId: 'test',
        date: '2025-01-01',
      });
    });

    expect(success).toBe(false);

    // Restaurar o mock original
    (authStore.useAuthStore as unknown as vi.Mock).mockReturnValue(originalUser);
  });

  it('deve lidar com erro na criação de transação', async () => {
    const { result } = renderHook(() => useTransactions());

    const error = new Error('API Error');
    mockStoreActions.addTransaction.mockRejectedValue(error);

    const success = await act(async () => {
      return await result.current.createTransaction({
        description: 'Test',
        amount: 100,
        type: 'EXPENSE',
        category: 'Test',
        categoryId: 'test',
        date: '2025-01-01',
      });
    });

    expect(success).toBe(false);
  });
});
