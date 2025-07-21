import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { api } from '../lib/api';
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
  refreshUser: () => Promise<void>;
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
          try {
            set({ isLoading: true, error: null });
            
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

            toast.success(`Welcome back, ${user.name}!`);
          } catch (error: unknown) {
            const message = error instanceof Error 
              ? error.message 
              : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
            set({
              error: message,
              isLoading: false,
              isAuthenticated: false,
            });
            toast.error(message);
            throw error;
          }
        },

        loginWithGoogle: async () => {
          try {
            set({ isLoading: true, error: null });
            
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;
            
            // Get Firebase ID token
            const firebaseToken = await firebaseUser.getIdToken();
            
            // Send to backend to create/get user and get JWT
            const response = await api.post('/auth/google', {
              firebaseToken,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              avatar: firebaseUser.photoURL,
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

            toast.success(`Welcome, ${user.name}!`);
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Google login failed';
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
            const message = error instanceof Error 
              ? error.message 
              : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
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
          // Sign out from Firebase
          signOut(auth).catch(() => {
            // Silent fail - we're logging out anyway
          });
          
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
          } catch {
            // If refresh fails, logout
            toast.error('Session expired. Please login again.');
            get().logout();
          }
        },

        initializeAuth: () => {
          // Listen to Firebase auth state changes
          onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
              // User is signed in with Firebase
              try {
                const firebaseToken = await firebaseUser.getIdToken();
                
                // Sync with backend
                const response = await api.post('/auth/firebase-sync', {
                  firebaseToken,
                  email: firebaseUser.email,
                  name: firebaseUser.displayName,
                  avatar: firebaseUser.photoURL,
                });

                const { user, token } = response.data;
                
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                set({
                  user,
                  token,
                  isAuthenticated: true,
                });
              } catch {
                // Failed to sync with backend - notify user
                toast.error('Failed to sync with server. Please try logging in again.');
              }
            } else {
              // User is signed out
              const currentState = get();
              if (currentState.isAuthenticated) {
                currentState.logout();
              }
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
