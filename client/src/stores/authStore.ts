import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { auth, signInWithEmail, signInWithGoogle, createUserWithEmail, signOutUser, onAuthStateChangedListener } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';
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
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
  clearError: () => void;
  initializeAuth: () => void;
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

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

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
            });
            toast.error(message);
            throw error;
          }
        },

        register: async (name: string, email: string, password: string) => {
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

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

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
            });
            toast.error(message);
            throw error;
          }
        },

        logout: () => {
          console.log('🚪 Fazendo logout...');
          signOutUser();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
          toast.success('Logout realizado com sucesso!');
        },

        setUser: (user: User, token: string) => {
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
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'auth-store' }
  )
);
