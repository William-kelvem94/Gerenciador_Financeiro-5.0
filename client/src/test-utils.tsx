import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Create a new QueryClient for each test to ensure isolation
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
      staleTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
  logger: {
    log: () => {},
    warn: () => {},
    error: () => {},
  },
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Helper para criar mocks de stores Zustand
export const createMockStore = <T extends Record<string, any>>(
  initialState: Partial<T>
) => {
  const store = new Proxy(initialState, {
    get: (target, prop) => {
      if (prop in target) {
        return target[prop as keyof T];
      }
      // Return a no-op function for missing methods
      return () => {};
    },
  }) as T;

  return store;
};

// Helper para mockar o useAuthStore
export const mockAuthStore = (state = {}) => {
  const defaultState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    clearError: vi.fn(),
    ...state,
  };

  return createMockStore(defaultState);
};

// Helper para mockar o useTransactionStore
export const mockTransactionStore = (state = {}) => {
  const defaultState = {
    transactions: [],
    isLoading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    filters: {},
    fetchTransactions: vi.fn(),
    addTransaction: vi.fn(),
    updateTransaction: vi.fn(),
    deleteTransaction: vi.fn(),
    setFilters: vi.fn(),
    clearError: vi.fn(),
    ...state,
  };

  return createMockStore(defaultState);
};

// Helper para mockar o useBudgetStore
export const mockBudgetStore = (state = {}) => {
  const defaultState = {
    budgets: [],
    currentBudget: null,
    isLoading: false,
    error: null,
    fetchBudgets: vi.fn(),
    createBudget: vi.fn(),
    updateBudget: vi.fn(),
    deleteBudget: vi.fn(),
    setCurrentBudget: vi.fn(),
    clearError: vi.fn(),
    ...state,
  };

  return createMockStore(defaultState);
};

// Helper para mockar respostas de API
export const mockApiResponse = function<T>(data: T, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve({
      success: status >= 200 && status < 300,
      data,
      message: status >= 200 && status < 300 ? 'Success' : 'Error',
    }),
    text: () => Promise.resolve(JSON.stringify(data)),
    headers: new Headers(),
    redirected: false,
    statusText: status >= 200 && status < 300 ? 'OK' : 'Error',
    type: 'basic' as ResponseType,
    url: '',
    clone: vi.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    blob: () => Promise.resolve(new Blob()),
    formData: () => Promise.resolve(new FormData()),
    bytes: () => Promise.resolve(new Uint8Array())
  } as unknown as Response;
};

// Helper para esperar por elementos async
export const waitForElement = async (callback: () => HTMLElement | null) => {
  return new Promise<HTMLElement>((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 50;
    
    const check = () => {
      const element = callback();
      if (element) {
        resolve(element);
        return;
      }
      
      attempts++;
      if (attempts >= maxAttempts) {
        reject(new Error('Element not found after maximum attempts'));
        return;
      }
      
      setTimeout(check, 100);
    };
    
    check();
  });
};

// Helper para simular eventos de usuário
export const createUserInteractions = (screen: any) => ({
  clickButton: async (buttonText: string) => {
    const { userEvent } = await import('@testing-library/user-event');
    
    const button = screen.getByRole('button', { name: buttonText });
    await userEvent.setup().click(button);
    return button;
  },
  
  fillInput: async (labelText: string, value: string) => {
    const { userEvent } = await import('@testing-library/user-event');
    
    const input = screen.getByLabelText(labelText);
    const user = userEvent.setup();
    await user.clear(input);
    await user.type(input, value);
    return input;
  },
  
  selectOption: async (labelText: string, optionText: string) => {
    const { userEvent } = await import('@testing-library/user-event');
    
    const select = screen.getByLabelText(labelText);
    await userEvent.setup().selectOptions(select, optionText);
    return select;
  }
});

// Função para limpar todos os mocks após cada teste
export const cleanupMocks = () => {
  vi.clearAllMocks();
  vi.clearAllTimers();
};

export default customRender;
