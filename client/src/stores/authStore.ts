import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (email: string, password: string) => {
          console.log('🔐 AuthStore login iniciado com:', { email, password });
          set({ isLoading: true, error: null });
          
          // Demo mode for testing - always enabled for demo credentials
          if (email === 'demo@willfinance.com' && password === 'demo123') {
            console.log('🎯 Entrando no modo demo');
            const demoUser = {
              id: 'demo-user-1',
              email: 'demo@willfinance.com',
              name: 'Demo User',
              avatar: '',
              createdAt: new Date().toISOString()
            };
            
            const demoToken = 'demo-token-123';
            
            console.log('📝 Definindo estado:', { demoUser, demoToken });
            set({
              user: demoUser,
              token: demoToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            console.log('✅ Estado definido com sucesso no modo demo');
            toast.success(`Bem-vindo de volta, ${demoUser.name}!`);
            return Promise.resolve(); // Retorno explícito para garantir sucesso
          }

          // Try real API login apenas se não for demo
          try {
            const response = await api.post('/auth/login', {
              email,
              password,
            });

            const { user, token } = response.data;
            
            // Set token in API defaults
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            toast.success(`Bem-vindo de volta, ${user.name}!`);
          } catch (error: unknown) {
            const apiError = error as ApiError;
            const message = apiError.response?.data?.message || 'Falha no login. Verifique suas credenciais.';
            set({
              error: message,
              isLoading: false,
              isAuthenticated: false,
            });
            toast.error(message);
            throw error;
          }
        },

        register: async (name: string, email: string, password: string) => {
          try {
            set({ isLoading: true, error: null });
            
            const response = await api.post('/auth/register', {
              name,
              email,
              password,
            });

            const { user, token } = response.data;
            
            // Set token in API defaults
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            toast.success(`Welcome to Will Finance, ${user.name}!`);
          } catch (error: unknown) {
            const apiError = error as ApiError;
            const message = apiError.response?.data?.message || 'Registration failed';
            set({
              error: message,
              isLoading: false,
              isAuthenticated: false,
            });
            toast.error(message);
            throw error;
          }
        },

        logout: () => {
          // Clear API token
          delete api.defaults.headers.common['Authorization'];
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });

          toast.success('Logged out successfully');
        },

        setUser: (user: User, token: string) => {
          // Set token in API defaults
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({
            user,
            token,
            isAuthenticated: true,
            error: null,
          });
        },

        clearError: () => {
          set({ error: null });
        },

        refreshUser: async () => {
          try {
            const { token } = get();
            if (!token) return;

            const response = await api.get('/auth/me');
            const user = response.data;

            set({ user });
          } catch (error) {
            console.error('Token refresh failed:', error);
            // If refresh fails, logout
            get().logout();
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          // Set token in API defaults when rehydrating
          if (state?.token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
          }
        },
      }
    ),
    { name: 'auth-store' }
  )
);
