import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { AuthGuard } from '@/components/AuthGuard'
import { FinanceProvider } from '@/contexts/FinanceContext'
import Toast from '@/components/common/Toast'

// Pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import GoogleCallbackPage from '@/pages/auth/GoogleCallbackPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { AccountsPage } from '@/pages/AccountsPage'
import { TransactionsPage } from '@/pages/TransactionsPage'
import { BudgetsPage } from '@/pages/BudgetsPage'
import { GoalsPage } from '@/pages/GoalsPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { ImportExportPage } from '@/pages/ImportExportPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function App() {
  // Teste básico primeiro - se isso não renderizar, temos um problema mais profundo
  try {
    const { isAuthenticated } = useAuthStore()
  } catch (error) {
    console.error('Erro no useAuthStore:', error)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Erro de Autenticação</h1>
          <p className="text-gray-300 mt-2">Problema ao carregar o store de autenticação</p>
          <pre className="text-xs mt-4 bg-gray-800 p-4 rounded">{error.toString()}</pre>
        </div>
      </div>
    )
  }
  const { isAuthenticated } = useAuthStore()

  // Connect to Socket.IO when user is authenticated - TEMPORARIAMENTE DESABILITADO
  /*
  useEffect(() => {
    if (isAuthenticated) {
      socketService.connect()
    } else {
      socketService.disconnect()
    }

    // Cleanup on unmount
    return () => {
      socketService.disconnect()
    }
  }, [isAuthenticated])
  */

  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-900 text-foreground relative overflow-hidden">
        {/* Conteúdo Principal */}
        <div className="relative z-20">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/auth/google/callback" 
              element={<GoogleCallbackPage />} 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <AuthGuard>
                  <Layout />
                </AuthGuard>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="accounts" element={<AccountsPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="budgets" element={<BudgetsPage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="import-export" element={<ImportExportPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          {/* Global Toast Notifications */}
          <Toast />
        </div>
      </div>
    </FinanceProvider>
  )
}

export default App
