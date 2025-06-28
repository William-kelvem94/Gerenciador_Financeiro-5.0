import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { FinanceProvider } from './contexts/FinanceContext'
import { Layout } from './components/Layout'
import { AuthGuard } from './components/AuthGuard'
import { MatrixRain } from './components/MatrixRain'
import { NotificationCenter } from './components/NotificationCenter'

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage'

// Main Pages
import DashboardPage from './pages/DashboardPage'
import { AccountsPage } from './pages/AccountsPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { BudgetsPage } from './pages/BudgetsPage'
import { GoalsPage } from './pages/GoalsPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { ImportExportPage } from './pages/ImportExportPage'
import { SettingsPage } from './pages/SettingsPage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  useEffect(() => {
    console.log('🚀 Will Finance 5.0 - Interface Principal Carregada!')
  }, [])

  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        {/* Matrix Rain Background Effect */}
        <MatrixRain />
        
        <AuthProvider>
          <FinanceProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <AuthGuard>
                  <Layout />
                </AuthGuard>
              }>
                {/* Dashboard - Default Route */}
                <Route index element={<DashboardPage />} />
                
                {/* Financial Management */}
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="accounts" element={<AccountsPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="budgets" element={<BudgetsPage />} />
                <Route path="goals" element={<GoalsPage />} />
                
                {/* Analytics & Reports */}
                <Route path="analytics" element={<AnalyticsPage />} />
                
                {/* Tools */}
                <Route path="import-export" element={<ImportExportPage />} />
                
                {/* Settings */}
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              
              {/* Fallback Routes */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>

            {/* Global Components */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1f2937',
                  color: '#f3f4f6',
                  border: '1px solid #10b981',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#1f2937',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#1f2937',
                  },
                },
              }}
            />
            
            <NotificationCenter />
          </FinanceProvider>
        </AuthProvider>
      </div>
    )
  } catch (error) {
    console.error('Erro na aplicação principal:', error)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Erro na Aplicação</h1>
          <p className="text-gray-300 mb-4">Houve um problema ao carregar o Will Finance</p>
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <pre className="text-xs text-left overflow-auto">
              {error?.toString()}
            </pre>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Recarregar Aplicação
          </button>
        </div>
      </div>
    )
  }
}

export default App
