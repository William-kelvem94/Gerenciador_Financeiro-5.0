// 🧪 Test Utilities - Will Finance 5.0
// Enterprise testing utilities with providers and mocks

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock providers para testes
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    document.body.classList.add('theme-cyberpunk');
    return () => document.body.classList.remove('theme-cyberpunk');
  }, []);
  
  return <div data-testid="theme-provider">{children}</div>;
};

const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="auth-provider">{children}</div>;
};

const MockNotificationProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="notification-provider">{children}</div>;
};

// All providers wrapper
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <MockThemeProvider>
        <MockAuthProvider>
          <MockNotificationProvider>
            {children}
          </MockNotificationProvider>
        </MockAuthProvider>
      </MockThemeProvider>
    </BrowserRouter>
  );
};

// Custom render function with providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing library
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Common test utilities
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockTransaction = (overrides = {}) => ({
  id: 'test-tx-123',
  description: 'Test Transaction',
  amount: 100,
  type: 'EXPENSE' as const,
  category: 'Test Category',
  categoryId: 'test-cat-123',
  date: new Date().toISOString(),
  userId: 'test-user-123',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockBudget = (overrides = {}) => ({
  id: 'test-budget-123',
  name: 'Test Budget',
  totalAmount: 1000,
  spent: 500,
  categoryId: 'test-cat-123',
  userId: 'test-user-123',
  period: 'monthly' as const,
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  isActive: true,
  ...overrides,
});

// Mock hooks for tests
export const mockUseAuthStore = () => ({
  user: createMockUser(),
  isAuthenticated: true,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  updateProfile: vi.fn(),
});

export const mockUseTransactionStore = () => ({
  transactions: [createMockTransaction()],
  loading: false,
  error: null,
  addTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  fetchTransactions: vi.fn(),
});

export const mockUseBudgetStore = () => ({
  budgets: [createMockBudget()],
  loading: false,
  error: null,
  addBudget: vi.fn(),
  updateBudget: vi.fn(),
  deleteBudget: vi.fn(),
  fetchBudgets: vi.fn(),
});

// Utilities for async testing
export const waitForLoadingToFinish = () => {
  return new Promise((resolve) => setTimeout(resolve, 0));
};

// Mock API responses
export const mockApiResponses = {
  success: (data: any) => ({
    success: true,
    data,
    message: 'Success',
    timestamp: new Date().toISOString(),
    requestId: 'test-req-123',
  }),
  error: (message: string) => ({
    success: false,
    error: {
      code: 'TEST_ERROR',
      message,
    },
    timestamp: new Date().toISOString(),
    requestId: 'test-req-123',
  }),
};
