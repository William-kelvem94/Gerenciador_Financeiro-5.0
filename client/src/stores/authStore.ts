import { create } from 'zustand';
<<<<<<< HEAD
import { persist, devtools } from 'zustand/middleware';
import { auth, signInWithEmail, signInWithGoogle, createUserWithEmail, signOutUser, onAuthStateChangedListener } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';
=======
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { api } from '../lib/api';
>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
<<<<<<< HEAD
  loginWithGoogle: () => Promise<void>;
=======
>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
  clearError: () => void;
<<<<<<< HEAD
  initializeAuth: () => void;
  syncUserWithDatabase: (user: User) => Promise<void>;
}

// Função para sincronizar usuário com banco de dados
const syncUserWithDatabase = async (user: User): Promise<void> => {
  try {
    console.log('🔄 Sincronizando usuário com banco de dados:', user.email);
    
    const response = await fetch('http://localhost:8080/api/users/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar || null,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na sincronização: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Usuário sincronizado com sucesso:', result);
  } catch (error) {
    console.error('❌ Erro ao sincronizar usuário:', error);
    // Não falha o login por causa da sincronização
  }
};

=======
  refreshUser: () => Promise<void>;
}

>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3
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
<<<<<<< HEAD
          console.log('🔐 Firebase login iniciado com:', { email });
          set({ isLoading: true, error: null });
          
          try {
            const userCredential = await signInWithEmail(email, password);
            const firebaseUser = userCredential.user;
            
            const token = await firebaseUser.getIdToken();
            
            const user: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
              avatar: firebaseUser.photoURL || '',
              createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
            };

            // Sincronizar com banco de dados local
            await syncUserWithDatabase(user);

=======
          try {
            set({ isLoading: true, error: null });
            
            // Demo mode for testing - remove in production
            if (email === 'demo@willfinance.com' && password === 'demo123') {
              const demoUser = {
                id: 'demo-user-1',
                email: 'demo@willfinance.com',
                name: 'Demo User',
                avatar: '',
                createdAt: new Date().toISOString()
              };
              
              const demoToken = 'demo-token-123';
              
              set({
                user: demoUser,
                token: demoToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });

              toast.success(`Welcome back, ${demoUser.name}!`);
              return;
            }
            
            const response = await api.post('/auth/login', {
              email,
              password,
            });

            const { user, token } = response.data;
            
            // Set token in API defaults
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

<<<<<<< HEAD
            console.log('✅ Login Firebase realizado com sucesso');
            toast.success(`Bem-vindo de volta, ${user.name}!`);
          } catch (error: unknown) {
            console.error('❌ Firebase login error:', error);
            let message = 'Erro ao fazer login. Verifique suas credenciais.';
            
            if (error && typeof error === 'object' && 'code' in error) {
              const firebaseError = error as { code: string };
              if (firebaseError.code === 'auth/user-not-found') {
                message = 'Usuário não encontrado. Verifique o email.';
              } else if (firebaseError.code === 'auth/wrong-password') {
                message = 'Senha incorreta.';
              } else if (firebaseError.code === 'auth/invalid-email') {
                message = 'Email inválido.';
              }
            }
            
            set({
              error: message,
              isLoading: false,
            });
            toast.error(message);
            throw error;
          }
        },

        loginWithGoogle: async () => {
          console.log('🔐 Google login iniciado');
          set({ isLoading: true, error: null });
          
          try {
            const userCredential = await signInWithGoogle();
            const firebaseUser = userCredential.user;
            
            const token = await firebaseUser.getIdToken();
            
            const user: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
              avatar: firebaseUser.photoURL || '',
              createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
            };

            // Sincronizar com banco de dados local
            await syncUserWithDatabase(user);

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            console.log('✅ Login Google realizado com sucesso');
            toast.success(`Bem-vindo, ${user.name}!`);
          } catch (error: unknown) {
            console.error('❌ Google login error:', error);
            let message = 'Erro ao fazer login com Google.';
            if (error && typeof error === 'object' && 'message' in error) {
              message = (error as { message: string }).message;
            }
            set({
              error: message,
              isLoading: false,
=======
            toast.success(`Welcome back, ${user.name}!`);
          } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed';
            set({
              error: message,
              isLoading: false,
              isAuthenticated: false,
>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3
            });
            toast.error(message);
            throw error;
          }
        },

        register: async (name: string, email: string, password: string) => {
<<<<<<< HEAD
          set({ isLoading: true, error: null });
          
          try {
            const userCredential = await createUserWithEmail(email, password);
            const firebaseUser = userCredential.user;
            
            // Update profile with name
            await updateProfile(firebaseUser, { displayName: name });
            
            const token = await firebaseUser.getIdToken();
            
            const user: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: name,
              avatar: firebaseUser.photoURL || '',
              createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
            };

            // Sincronizar com banco de dados local
            await syncUserWithDatabase(user);

=======
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
            
>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

<<<<<<< HEAD
            toast.success(`Conta criada com sucesso! Bem-vindo, ${user.name}!`);
          } catch (error: unknown) {
            console.error('Register error:', error);
            let message = 'Erro ao criar conta.';
            
            if (error && typeof error === 'object' && 'code' in error) {
              const firebaseError = error as { code: string };
              if (firebaseError.code === 'auth/email-already-in-use') {
                message = 'Este email já está em uso.';
              } else if (firebaseError.code === 'auth/weak-password') {
                message = 'A senha deve ter pelo menos 6 caracteres.';
              } else if (firebaseError.code === 'auth/invalid-email') {
                message = 'Email inválido.';
              }
            }
            
            set({
              error: message,
              isLoading: false,
=======
            toast.success(`Welcome to Will Finance, ${user.name}!`);
          } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed';
            set({
              error: message,
              isLoading: false,
              isAuthenticated: false,
>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3
            });
            toast.error(message);
            throw error;
          }
        },

        logout: () => {
<<<<<<< HEAD
          console.log('🚪 Fazendo logout...');
          signOutUser();
=======
          // Clear API token
          delete api.defaults.headers.common['Authorization'];
          
>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
<<<<<<< HEAD
          toast.success('Logout realizado com sucesso!');
        },

        setUser: (user: User, token: string) => {
=======

          toast.success('Logged out successfully');
        },

        setUser: (user: User, token: string) => {
          // Set token in API defaults
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3
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

<<<<<<< HEAD
        initializeAuth: () => {
          console.log('🔄 Inicializando autenticação Firebase...');
          onAuthStateChangedListener(auth, async (firebaseUser) => {
            if (firebaseUser) {
              try {
                const token = await firebaseUser.getIdToken();
                const user: User = {
                  id: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
                  avatar: firebaseUser.photoURL || '',
                  createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
                };

                // Sincronizar com banco de dados local
                await syncUserWithDatabase(user);

                set({
                  user,
                  token,
                  isAuthenticated: true,
                  isLoading: false,
                });
                console.log('✅ Usuário autenticado restaurado:', user.email);
              } catch (error) {
                console.error('Erro ao obter token:', error);
                get().logout();
              }
            } else {
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
              });
              console.log('📤 Usuário não autenticado');
            }
          });
        },

        syncUserWithDatabase: syncUserWithDatabase,
=======
        refreshUser: async () => {
          try {
            const { token } = get();
            if (!token) return;

            const response = await api.get('/auth/me');
            const user = response.data;

            set({ user });
          } catch (error) {
            // If refresh fails, logout
            get().logout();
          }
        },
>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
<<<<<<< HEAD
=======
        onRehydrateStorage: () => (state) => {
          // Set token in API defaults when rehydrating
          if (state?.token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
          }
        },
>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3
      }
    ),
    { name: 'auth-store' }
  )
);
