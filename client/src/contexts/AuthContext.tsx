import React, { 
  createContext, 
  useState, 
  useContext, 
  useEffect, 
  ReactNode 
} from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { apiService } from '../services/api';
import { authService } from '../services/auth';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  isEmailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUserData: () => Promise<void>;
  verifyEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Obter dados completos do usuário do backend
          const userData = await apiService.getUserProfile();
          setUser(userData);
        } catch (error) {
          console.error('Erro ao obter dados do usuário:', error);
          // Se não conseguir obter do backend, usar dados do Firebase
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Usuário',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || undefined,
            isEmailVerified: firebaseUser.emailVerified,
            createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
            updatedAt: new Date()
          });
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const firebaseUser = await authService.signInWithEmailAndPassword(email, password);
      
      // Verificar se o usuário existe no backend
      try {
        const userData = await apiService.getUserProfile();
        setUser(userData);
      } catch (error) {
        // Se não existir no backend, criar o usuário
        const userData = await apiService.createUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Usuário',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || undefined
        });
        setUser(userData);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<void> => {
    try {
      setLoading(true);
      const firebaseUser = await authService.createUserWithEmailAndPassword(email, password);
      
      // Atualizar perfil no Firebase
      await authService.updateProfile({
        displayName: name
      });
      
      // Criar usuário no backend
      const userData = await apiService.createUser({
        id: firebaseUser.uid,
        name,
        email,
        avatar: firebaseUser.photoURL || undefined
      });
      
      setUser(userData);
      
      // Enviar email de verificação
      await authService.sendEmailVerification();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      const firebaseUser = await authService.signInWithGoogle();
      
      // Verificar se o usuário existe no backend
      try {
        const userData = await apiService.getUserProfile();
        setUser(userData);
      } catch (error) {
        // Se não existir no backend, criar o usuário
        const userData = await apiService.createUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Usuário',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || undefined
        });
        setUser(userData);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      const updatedUser = await apiService.updateUserProfile(data);
      setUser(updatedUser);
      
      // Atualizar também no Firebase se necessário
      if (data.name && firebaseUser) {
        await authService.updateProfile({
          displayName: data.name
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const refreshUserData = async (): Promise<void> => {
    if (!firebaseUser) return;
    
    try {
      const userData = await apiService.getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      throw error;
    }
  };

  const verifyEmail = async (): Promise<void> => {
    if (!firebaseUser) throw new Error('Usuário não autenticado');
    
    try {
      await authService.sendEmailVerification();
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await authService.sendPasswordResetEmail(email);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    isAuthenticated: !!user && !!firebaseUser,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
    refreshUserData,
    verifyEmail,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
