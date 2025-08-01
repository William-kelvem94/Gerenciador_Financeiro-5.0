import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuthStore } from './stores/authStore';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/Login/LoginPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { TransactionsPage } from './pages/Transactions/TransactionsPage';
import { BudgetsPage } from './pages/Budgets/BudgetsPage';
import { ReportsPage } from './pages/Reports/ReportsPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { AuthCallback } from './components/auth/AuthCallback';

function App() {
  const { isAuthenticated, refreshUser, user } = useAuthStore();

  useEffect(() => {
    // Refresh user data if authenticated
    if (isAuthenticated && user) {
      refreshUser();
    }
  }, [isAuthenticated, user, refreshUser]);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300 cyberpunk-container">
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
            />
            {/* <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
            /> */}
            <Route 
              path="/auth/callback" 
              element={<AuthCallback />} 
            />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="budgets" element={<BudgetsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* 404 fallback */}
            <Route 
              path="*" 
              element={
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="min-h-screen flex items-center justify-center bg-bg-primary"
                >
                  <div className="text-center cyberpunk-card p-8">
                    <h1 className="text-6xl font-bold text-primary mb-4 neon-glow">404</h1>
                    <p className="text-text-secondary mb-8">Página não encontrada no nexus</p>
                    <button 
                      onClick={() => window.history.back()}
                      className="cyberpunk-btn"
                    >
                      Voltar ao Sistema
                    </button>
                  </div>
                </motion.div>
              } 
            />
          </Routes>

          {/* Global toast notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--color-bg-card)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-primary)',
                borderRadius: '8px',
                boxShadow: '0 0 10px var(--color-neon-shadow)',
              },
              success: {
                iconTheme: {
                  primary: 'var(--color-success)',
                  secondary: 'var(--color-bg-primary)',
                },
              },
              error: {
                iconTheme: {
                  primary: 'var(--color-error)',
                  secondary: 'var(--color-bg-primary)',
                },
              },
            }}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
