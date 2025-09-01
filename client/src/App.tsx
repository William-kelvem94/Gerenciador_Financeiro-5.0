import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Layout } from '@/layouts/Layout';
import { CyberLoginPage } from '@/pages/Login/CyberLoginPage';
import CyberDashboard from '@/pages/Dashboard/CyberDashboard';
import { TransactionsPage } from '@/pages/Transactions/TransactionsPage';
import { BudgetsPage } from '@/pages/Budgets/BudgetsPage';
import { ReportsPage } from '@/pages/Reports/ReportsPage';
import { SettingsPage } from '@/pages/Settings/SettingsPage';
import ImportExportPage from '@/pages/ImportExport/ImportExportPage';
import { AuthCallback } from '@/components/auth/AuthCallback';

// Importar estilos do react-toastify
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Adiciona função de inicialização de autenticação se existir
    const initializeAuth = (window as any).initializeAuth || (() => {});
    // Inicializa listener de autenticação (ajuste para compatibilidade)
    if (typeof initializeAuth === 'function') {
      initializeAuth();
    }
  }, []);

  useEffect(() => {
    // Log user authentication status
    if (isAuthenticated && user) {
      console.log('✅ Usuário autenticado:', user.email);
    }
  }, [isAuthenticated, user]);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-black text-white transition-colors duration-300">
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <CyberLoginPage />}
            />
            {/* <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
            /> */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<CyberDashboard />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="budgets" element={<BudgetsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="import-export" element={<ImportExportPage />} />
            </Route>

            {/* 404 fallback */}
            <Route
              path="*"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex min-h-screen items-center justify-center bg-black"
                >
                  <div className="card p-8 text-center">
                    <h1 className="text-cyber-primary text-glow mb-4 text-6xl font-bold">404</h1>
                    <p className="text-white-secondary mb-8">Página não encontrada no nexus</p>
                    <button onClick={() => window.history.back()} className="btn-primary">
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

          {/* React Toastify para notificações aprimoradas */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastStyle={{
              backgroundColor: 'var(--background-secondary, #1A1A2E)',
              color: 'var(--foreground, #FFFFFF)',
              border: '1px solid var(--cyber-primary, #00FFFF)',
              borderRadius: '8px',
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
            }}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
