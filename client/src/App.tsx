import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/Login/LoginPage';
import { RegisterPage } from './pages/Register/RegisterPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { TransactionsPage } from './pages/Transactions/TransactionsPage';
import { BudgetsPage } from './pages/Budgets/BudgetsPage';
import { ReportsPage } from './pages/Reports/ReportsPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { ThemeShowcase } from './pages/ThemeShowcase/ThemeShowcase';
import { AuthCallback } from './components/auth/AuthCallback';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

function App() {
  const { isAuthenticated, refreshUser, user, initializeAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.className = `theme-${theme}`;
    
    // Initialize Firebase Auth listener
    initializeAuth();
    
    // Refresh user data if authenticated
    if (isAuthenticated && user) {
      refreshUser();
    }
  }, [theme, initializeAuth, isAuthenticated, user, refreshUser]);

  return (
    <ErrorBoundary>
      <Router>
        <div className={`min-h-screen transition-all duration-300 theme-${theme}`}>
          <div className="gradient-bg min-h-screen">
            <Routes>
              {/* Public routes */}
              <Route 
                path="/login" 
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
              />
              <Route path="/register" 
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
              />
              <Route 
                path="/themes" 
                element={<ThemeShowcase />} 
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
                  className="min-h-screen flex items-center justify-center"
                >
                  <div className="text-center">
                    <h1 className="text-6xl font-bold mb-4" style={{ color: 'rgb(var(--primary))' }}>404</h1>
                    <p className="mb-8" style={{ color: 'rgb(var(--muted-foreground))' }}>Page not found</p>
                    <button 
                      onClick={() => window.history.back()}
                      className="px-6 py-3 rounded-lg transition-all hover-glow"
                      style={{ 
                        backgroundColor: 'rgb(var(--primary))', 
                        color: 'rgb(var(--primary-foreground))'
                      }}
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
                background: 'rgb(var(--card))',
                color: 'rgb(var(--card-foreground))',
                border: '1px solid rgb(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)',
              },
              success: {
                iconTheme: {
                  primary: 'rgb(var(--primary))',
                  secondary: 'rgb(var(--primary-foreground))',
                },
              },
              error: {
                iconTheme: {
                  primary: 'rgb(var(--destructive))',
                  secondary: 'rgb(var(--destructive-foreground))',
                },
              },
            }}
          />

          {/* PWA install prompt component could go here */}
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
