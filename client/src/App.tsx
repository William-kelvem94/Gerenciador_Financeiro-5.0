import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuthStore } from './stores/authStore';
import { useUIStore } from './stores/uiStore';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/Login/LoginPage';
import { RegisterPage } from './pages/Register/RegisterPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { TransactionsPage } from './pages/Transactions/TransactionsPage';
import { BudgetsPage } from './pages/Budgets/BudgetsPage';
import { ReportsPage } from './pages/Reports/ReportsPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { AuthCallback } from './components/auth/AuthCallback';
// import { LoadingScreen } from './components/ui/LoadingScreen';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

function App() {
  const { isAuthenticated, refreshUser, user } = useAuthStore();
  const { theme, setTheme } = useUIStore();

  useEffect(() => {
    // Initialize theme
    setTheme(theme);
    
    // Refresh user data if authenticated
    if (isAuthenticated && user) {
      refreshUser();
    }
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
            />
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
                  className="min-h-screen flex items-center justify-center bg-background"
                >
                  <div className="text-center">
                    <h1 className="text-6xl font-cyber text-cyber-primary mb-4">404</h1>
                    <p className="text-foreground-secondary mb-8">Page not found</p>
                    <button 
                      onClick={() => window.history.back()}
                      className="px-6 py-3 bg-cyber-primary text-cyber-dark rounded-lg hover:bg-cyber-secondary transition-colors"
                    >
                      Go Back
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
                background: theme === 'cyberpunk' ? '#1A1A1A' : '#1f2937',
                color: theme === 'cyberpunk' ? '#00FFFF' : '#f3f4f6',
                border: theme === 'cyberpunk' ? '1px solid #00FFFF' : '1px solid #374151',
                borderRadius: '8px',
                boxShadow: theme === 'cyberpunk' ? '0 0 10px #00FFFF' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#39FF14',
                  secondary: '#0A0A0A',
                },
              },
              error: {
                iconTheme: {
                  primary: '#FF0040',
                  secondary: '#0A0A0A',
                },
              },
            }}
          />

          {/* PWA install prompt component could go here */}
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
