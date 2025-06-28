import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireEmailVerification = false,
  requiredRole 
}) => {
  const { user, firebaseUser, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyber-primary mx-auto mb-4" />
          <p className="text-cyber-primary">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirecionar para login se não autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar se email precisa ser verificado
  if (requireEmailVerification && firebaseUser && !firebaseUser.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Verificar role do usuário
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo = '/dashboard' 
}) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyber-primary mx-auto mb-4" />
          <p className="text-cyber-primary">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirecionar se já autenticado
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
