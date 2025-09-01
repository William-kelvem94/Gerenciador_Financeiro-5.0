// 🧪 AuthStore Tests - Will Finance 5.0
// Enterprise-grade Zustand store testing

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useAuthStore } from '../stores/authStore';

// Enhanced localStorage mock for Zustand persist
let store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key];
  }),
  clear: vi.fn(() => {
    store = {};
  }),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

// Mock API
const mockApi = {
  post: vi.fn(),
  get: vi.fn(),
  defaults: { 
    headers: { 
      common: {} 
    } 
  },
};

vi.mock('../lib/api', () => ({
  api: mockApi,
}));

describe('AuthStore - Validações Críticas', () => {
  beforeEach(() => {
    // Reset store state
    store = {};
    vi.clearAllMocks();
    
    // Reset Zustand store state
    const { logout } = useAuthStore.getState();
    logout();
  });

  it('deve inicializar com estado padrão', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve permitir login com dados de demo', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      await result.current.login('demo@willfinance.com', 'demo123');
    });
    
    expect(result.current.user).toBeTruthy();
    expect(result.current.user?.email).toBe('demo@willfinance.com');
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe('demo-token-123');
  });

  it('deve setUser com token corretamente', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date().toISOString(),
    };
    const mockToken = 'test-token-123';

    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      result.current.setUser(mockUser, mockToken);
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('deve limpar estado no logout', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date().toISOString(),
    };

    const { result } = renderHook(() => useAuthStore());
    
    // Primeiro fazer login
    await act(async () => {
      result.current.setUser(mockUser, 'test-token');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    
    // Depois fazer logout
    await act(async () => {
      result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('deve gerenciar erro de login com credenciais inválidas', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    // Mock API para retornar erro
    mockApi.post.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Credenciais inválidas'
        }
      }
    });
    
    await act(async () => {
      try {
        await result.current.login('invalid@email.com', 'wrongpassword');
      } catch {
        // Erro esperado
      }
    });
    
    expect(result.current.error).toBe('Credenciais inválidas');
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('deve limpar erro usando clearError', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    // Primeiro definir um erro
    mockApi.post.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Erro de teste'
        }
      }
    });
    
    await act(async () => {
      try {
        await result.current.login('test@test.com', 'wrong');
      } catch {
        // Erro esperado
      }
    });
    
    expect(result.current.error).toBe('Erro de teste');
    
    // Limpar erro
    await act(async () => {
      result.current.clearError();
    });
    
    expect(result.current.error).toBeNull();
  });

  it('deve fazer refresh do usuário com sucesso', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User Updated',
      createdAt: new Date().toISOString(),
    };

    const { result } = renderHook(() => useAuthStore());
    
    // Primeiro fazer login
    await act(async () => {
      result.current.setUser(mockUser, 'test-token');
    });
    
    // Mock API para retornar usuário atualizado
    mockApi.get.mockResolvedValueOnce({
      data: { ...mockUser, name: 'Test User Refreshed' }
    });
    
    await act(async () => {
      await result.current.refreshUser();
    });
    
    expect(result.current.user?.name).toBe('Test User Refreshed');
  });
});
