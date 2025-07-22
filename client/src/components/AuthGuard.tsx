import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface AuthGuardProps {
  readonly children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuthStore()

  // TEMPORÁRIO: Desabilitando autenticação para desenvolvimento
  const BYPASS_AUTH = import.meta.env.NODE_ENV === 'development'

  if (!isAuthenticated && !BYPASS_AUTH) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
