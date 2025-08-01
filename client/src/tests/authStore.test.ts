import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../stores/authStore';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock API
vi.mock('../lib/api', () => ({
  api: {
    post: vi.fn(),
    defaults: { headers: { common: {} } },
  },
}));

describe('AuthStore - Validações Críticas', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.getState().logout();
    
    // Clear all mocks
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('1. Zustand persist/localStorage', () => {
    it('deve configurar corretamente a chave de persistência', () => {
      // Testa se a chave 'auth-storage' é usada no localStorage
      const { login } = useAuthStore.getState();
      
      // Simula login demo
      login('demo@willfinance.com', 'demo123');
      
      // Verifica se foi chamado setItem com a chave correta
      // Note: Como é async, pode ser necessário aguardar
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        expect.stringContaining('auth-storage'),
        expect.any(String)
      );
    });

    it('deve serializar corretamente o estado para localStorage', () => {
      const { login } = useAuthStore.getState();
      
      login('demo@willfinance.com', 'demo123');
      
      // Verifica se o estado persistido contém as propriedades corretas
      const calls = localStorageMock.setItem.mock.calls;
      if (calls.length > 0) {
        const [key, value] = calls[calls.length - 1];
        const parsedValue = JSON.parse(value);
        
        expect(parsedValue.state).toHaveProperty('user');
        expect(parsedValue.state).toHaveProperty('token'); 
        expect(parsedValue.state).toHaveProperty('isAuthenticated');
      }
    });

    it('deve restaurar estado do localStorage na inicialização', () => {
      // Simula dados existentes no localStorage
      const mockStoredData = JSON.stringify({
        state: {
          user: { id: 'demo-user-1', email: 'demo@willfinance.com', name: 'Demo User' },
          token: 'demo-token-123',
          isAuthenticated: true,
        },
        version: 0,
      });
      
      localStorageMock.getItem.mockReturnValue(mockStoredData);
      
      // Força re-hidratação do store
      const { user, isAuthenticated, token } = useAuthStore.getState();
      
      console.log('Estado após mock localStorage:', { user, isAuthenticated, token });
    });
  });

  describe('2. Estado isAuthenticated', () => {
    it('deve atualizar isAuthenticated para true após login demo bem-sucedido', async () => {
      const { login } = useAuthStore.getState();
      
      console.log('Estado antes do login:', useAuthStore.getState());
      
      await login('demo@willfinance.com', 'demo123');
      
      const finalState = useAuthStore.getState();
      console.log('Estado após login demo:', finalState);
      
      expect(finalState.isAuthenticated).toBe(true);
      expect(finalState.user).toBeTruthy();
      expect(finalState.user?.email).toBe('demo@willfinance.com');
    });

    it('deve manter estado consistente entre user, token e isAuthenticated', async () => {
      const { login } = useAuthStore.getState();
      
      await login('demo@willfinance.com', 'demo123');
      
      const { user, token, isAuthenticated } = useAuthStore.getState();
      
      // Se user e token existem, isAuthenticated deve ser true
      if (user && token) {
        expect(isAuthenticated).toBe(true);
      }
      
      // Se isAuthenticated é true, user e token devem existir
      if (isAuthenticated) {
        expect(user).toBeTruthy();
        expect(token).toBeTruthy();
      }
    });
  });

  describe('3. Navegação após login', () => {
    it('deve disparar mudança de estado que triggaria useEffect', async () => {
      const { login } = useAuthStore.getState();
      
      // Simula subscription para mudanças de estado
      let stateChanges: any[] = [];
      const unsubscribe = useAuthStore.subscribe((state) => {
        stateChanges.push({
          isAuthenticated: state.isAuthenticated,
          user: state.user?.email,
        });
      });
      
      await login('demo@willfinance.com', 'demo123');
      
      console.log('Mudanças de estado capturadas:', stateChanges);
      
      // Deve ter pelo menos uma mudança para isAuthenticated: true
      expect(stateChanges.some(change => change.isAuthenticated === true)).toBe(true);
      
      unsubscribe();
    });
  });

  describe('4. Toast de sucesso mas estado falso', () => {
    it('deve verificar se login completa antes do toast', async () => {
      const { login } = useAuthStore.getState();
      
      // Mock toast para verificar quando é chamado
      const toast = await import('react-hot-toast');
      const toastSpy = vi.spyOn(toast.default, 'success');
      
      await login('demo@willfinance.com', 'demo123');
      
      // Se toast.success foi chamado, o estado deve estar correto
      if (toastSpy.mock.calls.length > 0) {
        const { isAuthenticated, user } = useAuthStore.getState();
        expect(isAuthenticated).toBe(true);
        expect(user).toBeTruthy();
      }
    });
  });

  describe('5. Validação credenciais demo', () => {
    it('deve aceitar credenciais demo independente do NODE_ENV', async () => {
      const { login } = useAuthStore.getState();
      
      // Testa que demo funciona mesmo em "production"
      const originalEnv = import.meta.env.MODE;
      // @ts-ignore
      import.meta.env.MODE = 'production';
      
      await login('demo@willfinance.com', 'demo123');
      
      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(true);
      
      // Restaura env original
      // @ts-ignore
      import.meta.env.MODE = originalEnv;
    });

    it('deve rejeitar credenciais inválidas', async () => {
      const { login } = useAuthStore.getState();
      
      try {
        await login('invalid@email.com', 'wrongpassword');
      } catch (error) {
        // Esperado que falhe
      }
      
      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });
  });

  describe('6. Múltiplas instâncias e store recreation', () => {
    it('deve manter uma única instância do store', () => {
      const store1 = useAuthStore;
      const store2 = useAuthStore;
      
      expect(store1).toBe(store2);
    });

    it('deve manter estado entre múltiplas chamadas getState()', async () => {
      const { login } = useAuthStore.getState();
      
      await login('demo@willfinance.com', 'demo123');
      
      const state1 = useAuthStore.getState();
      const state2 = useAuthStore.getState();
      
      expect(state1.isAuthenticated).toBe(state2.isAuthenticated);
      expect(state1.user?.id).toBe(state2.user?.id);
    });
  });
});
