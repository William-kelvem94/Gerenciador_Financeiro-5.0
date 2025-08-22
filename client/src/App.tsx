import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardPage from './pages/Dashboard/DashboardPage';
import TransactionsPage from './pages/Transactions/TransactionsPage';
import BudgetsPage from './pages/Budgets/BudgetsPage';
import ReportsPage from './pages/Reports/ReportsPage';
import SettingsPage from './pages/Settings/SettingsPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Layout>
      <Suspense fallback={<div className="animate-pulse text-cyber-primary">Carregando...</div>}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" />
    </Layout>
  );
}

export default App;
