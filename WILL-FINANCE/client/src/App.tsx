import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { AuthGuard } from '@/components/AuthGuard'
import { MatrixRain } from '@/components/MatrixRain'
import { socketService } from '@/services/socket'

// Pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { AccountsPage } from '@/pages/AccountsPage'
import { TransactionsPage } from '@/pages/TransactionsPage'
import { BudgetsPage } from '@/pages/BudgetsPage'
import { GoalsPage } from '@/pages/GoalsPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function App() {
  const { isAuthenticated } = useAuthStore()

  // Connect to Socket.IO when user is authenticated
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MatrixRain />
      
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
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1A1A1A',
            color: '#FFFFFF',
            border: '1px solid #333333',
          },
          success: {
            iconTheme: {
              primary: '#39FF14',
              secondary: '#1A1A1A',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF0040',
              secondary: '#1A1A1A',
            },
          },
        }}
      />
    </div>
  )
}

export default App
