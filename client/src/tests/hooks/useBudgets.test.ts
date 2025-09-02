// 🧪 Comprehensive Test Suite for useBudgets Hook
// Enterprise-level testing with advanced mocking and performance validation

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock data
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User'
};

const mockBudgets = [
  {
    id: 'budget-1',
    name: 'Monthly Budget',
    description: 'Monthly food budget',
    amount: 2000,
    spent: 1200,
    remaining: 800,
    category: 'Food',
    categoryId: 'cat-1',
    period: 'MONTHLY' as const,
    userId: 'user-123',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    isActive: true,
    alertThreshold: 80,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'budget-2',
    name: 'Weekly Budget',
    description: 'Weekly transport budget',
    amount: 500,
    spent: 300,
    remaining: 200,
    category: 'Transport',
    categoryId: 'cat-2',
    period: 'WEEKLY' as const,
    userId: 'user-123',
    startDate: '2025-01-01',
    endDate: '2025-01-07',
    isActive: true,
    alertThreshold: 80,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  }
];

// Mock store actions
const mockStoreActions = {
  budgets: mockBudgets,
  isLoading: false,
  error: null,
  fetchBudgets: vi.fn(),
  addBudget: vi.fn(),
  updateBudget: vi.fn(),
  deleteBudget: vi.fn(),
  setBudgets: vi.fn(),
  setLoading: vi.fn(),
  setError: vi.fn()
};

// Mock the stores BEFORE importing anything
vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({ user: mockUser }))
}));

vi.mock('../../stores/budgetStore', () => ({
  useBudgetStore: vi.fn(() => mockStoreActions)
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
import { useBudgets } from '../../hooks/useBudgets';
import * as authStore from '../../stores/authStore';
import * as budgetStore from '../../stores/budgetStore';
import toast from 'react-hot-toast';

describe('useBudgets Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Initialization', () => {
    it('should initialize with budgets', () => {
      const { result } = renderHook(() => useBudgets());

      expect(result.current.budgets).toEqual(mockBudgets);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should calculate statistics correctly', () => {
      const { result } = renderHook(() => useBudgets());

      expect(result.current.statistics.activeBudgets).toHaveLength(2);
      expect(result.current.statistics.totalBudgetAmount).toBe(2500);
      expect(result.current.statistics.totalSpent).toBe(1500);
    });

    it('should handle empty budgets', () => {
      (budgetStore.useBudgetStore as any).mockReturnValue({
        ...mockStoreActions,
        budgets: [],
        statistics: {
          activeBudgets: [],
          totalBudgetAmount: 0,
          totalSpent: 0,
          utilizationPercentage: 0,
          categoryUsage: {}
        }
      });

      const { result } = renderHook(() => useBudgets());

      expect(result.current.statistics.activeBudgets).toHaveLength(0);
      expect(result.current.statistics.totalBudgetAmount).toBe(0);
      expect(result.current.statistics.totalSpent).toBe(0);
    });
  });

  describe('fetchBudgets', () => {
    it('should fetch budgets successfully', async () => {
      mockStoreActions.fetchBudgets.mockResolvedValue(undefined);

      const { result } = renderHook(() => useBudgets());

      await act(async () => {
        await result.current.fetchBudgets();
      });

      expect(mockStoreActions.fetchBudgets).toHaveBeenCalled();
    });

    it('should handle fetch errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockStoreActions.fetchBudgets.mockRejectedValue(new Error('Fetch error'));

      const { result } = renderHook(() => useBudgets());

      await act(async () => {
        await result.current.fetchBudgets();
      });

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching budgets:', expect.any(Error));
      consoleSpy.mockRestore();
    });

    it('should not fetch when user is not authenticated', async () => {
      (authStore.useAuthStore as any).mockReturnValue({
        user: null
      });

      const { result } = renderHook(() => useBudgets());

      await act(async () => {
        await result.current.fetchBudgets();
      });

      expect(mockStoreActions.fetchBudgets).not.toHaveBeenCalled();
    });
  });

  describe('createBudget', () => {
    const mockBudgetData = {
      name: 'New Budget',
      amount: 1000,
      category: 'Transport',
      categoryId: 'cat-3',
      period: 'MONTHLY' as const,
      startDate: '2025-02-01',
      endDate: '2025-02-28',
    };

    it('should create budget successfully', async () => {
      mockStoreActions.addBudget.mockResolvedValue(undefined);

      const { result } = renderHook(() => useBudgets());

      let createResult: boolean | undefined;
      await act(async () => {
        createResult = await result.current.createBudget(mockBudgetData);
      });

      expect(createResult).toBe(true);
      expect(mockStoreActions.addBudget).toHaveBeenCalledWith({
        ...mockBudgetData,
        userId: mockUser.id,
        spent: 0,
        isActive: true,
        remaining: mockBudgetData.amount,
      });
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('should handle creation errors', async () => {
      const errorMessage = 'Creation failed';
      mockStoreActions.addBudget.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useBudgets());

      let createResult: boolean | undefined;
      await act(async () => {
        createResult = await result.current.createBudget(mockBudgetData);
      });

      expect(createResult).toBe(false);
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });

    it('should handle unauthenticated user', async () => {
      (authStore.useAuthStore as any).mockReturnValue({
        user: null
      });

      const { result } = renderHook(() => useBudgets());

      let createResult: boolean | undefined;
      await act(async () => {
        createResult = await result.current.createBudget(mockBudgetData);
      });

      expect(createResult).toBe(false);
      expect(mockStoreActions.addBudget).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Usuário não autenticado');
    });
  });

  describe('updateBudget', () => {
    const updateData = {
      name: 'Updated Budget',
      amount: 1500,
    };

    it('should update budget successfully', async () => {
      mockStoreActions.updateBudget.mockResolvedValue(undefined);

      const { result } = renderHook(() => useBudgets());

      let updateResult: boolean | undefined;
      await act(async () => {
        updateResult = await result.current.updateBudget('budget-1', updateData);
      });

      expect(updateResult).toBe(true);
      expect(mockStoreActions.updateBudget).toHaveBeenCalledWith('budget-1', updateData);
    });

    it('should handle update errors', async () => {
      const errorMessage = 'Update failed';
      mockStoreActions.updateBudget.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useBudgets());

      let updateResult: boolean | undefined;
      await act(async () => {
        updateResult = await result.current.updateBudget('budget-1', updateData);
      });

      expect(updateResult).toBe(false);
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('deleteBudget', () => {
    it('should delete budget successfully', async () => {
      mockStoreActions.deleteBudget.mockResolvedValue(undefined);

      const { result } = renderHook(() => useBudgets());

      let deleteResult: boolean | undefined;
      await act(async () => {
        deleteResult = await result.current.deleteBudget('budget-1');
      });

      expect(deleteResult).toBe(true);
      expect(mockStoreActions.deleteBudget).toHaveBeenCalledWith('budget-1');
    });

    it('should handle delete errors', async () => {
      const errorMessage = 'Delete failed';
      mockStoreActions.deleteBudget.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useBudgets());

      let deleteResult: boolean | undefined;
      await act(async () => {
        deleteResult = await result.current.deleteBudget('budget-1');
      });

      expect(deleteResult).toBe(false);
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  // Remove the getBudgetById, getBudgetsByCategory, getOverBudgetItems tests
  // as these methods don't exist in the actual hook
  
  describe('categoryUsage', () => {
    it('should access category usage through statistics', () => {
      const { result } = renderHook(() => useBudgets());
      
      // Category usage is available through statistics
      expect(result.current.statistics.categoryUsage).toBeDefined();
      expect(typeof result.current.statistics.categoryUsage).toBe('object');
    });
  });

  describe('Performance Optimizations', () => {
    it('should maintain stable references', () => {
      const { result, rerender } = renderHook(() => useBudgets());

      const firstRender = {
        statistics: result.current.statistics,
        fetchBudgets: result.current.fetchBudgets,
        createBudget: result.current.createBudget,
        updateBudget: result.current.updateBudget,
        deleteBudget: result.current.deleteBudget,
      };

      rerender();

      const secondRender = {
        statistics: result.current.statistics,
        fetchBudgets: result.current.fetchBudgets,
        createBudget: result.current.createBudget,
        updateBudget: result.current.updateBudget,
        deleteBudget: result.current.deleteBudget,
      };

      // Functions should maintain stable references
      expect(firstRender.fetchBudgets).toBe(secondRender.fetchBudgets);
      expect(firstRender.createBudget).toBe(secondRender.createBudget);
      expect(firstRender.updateBudget).toBe(secondRender.updateBudget);
      expect(firstRender.deleteBudget).toBe(secondRender.deleteBudget);

      // Computed values should maintain stable references when data doesn't change
      expect(firstRender.statistics).toBe(secondRender.statistics);
    });

    it('should recalculate when budgets change', () => {
      const { result, rerender } = renderHook(() => useBudgets());

      const initialStats = result.current.statistics;

      // Change budgets data
      (budgetStore.useBudgetStore as any).mockReturnValue({
        ...mockStoreActions,
        budgets: [mockBudgets[0]], // Only first budget
      });

      rerender();

      const newStats = result.current.statistics;

      expect(newStats).not.toBe(initialStats);
      expect(newStats.activeBudgets).toHaveLength(1);
      expect(newStats.totalBudgetAmount).toBe(2000);
    });
  });

  describe('Error Handling', () => {
    it('should handle store errors gracefully', () => {
      (budgetStore.useBudgetStore as any).mockReturnValue({
        ...mockStoreActions,
        budgets: [],
        error: 'Store error',
      });

      const { result } = renderHook(() => useBudgets());

      expect(result.current.error).toBe('Store error');
      expect(result.current.budgets).toHaveLength(0);
    });

    it('should handle loading state', () => {
      (budgetStore.useBudgetStore as any).mockReturnValue({
        ...mockStoreActions,
        isLoading: true,
      });

      const { result } = renderHook(() => useBudgets());

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle division by zero in utilization percentage', () => {
      (budgetStore.useBudgetStore as any).mockReturnValue({
        ...mockStoreActions,
        budgets: [{
          id: 'budget-1',
          name: 'Zero Budget',
          description: 'Zero budget test',
          amount: 0,
          spent: 100,
          remaining: -100,
          category: 'Food',
          categoryId: 'cat-1',
          period: 'MONTHLY' as const,
          userId: 'user-123',
          startDate: '2025-01-01',
          endDate: '2025-01-31',
          isActive: true,
          alertThreshold: 80,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z'
        }],
      });

      const { result } = renderHook(() => useBudgets());

      expect(result.current.statistics.utilizationPercentage).toBe(0);
    });
  });
});
