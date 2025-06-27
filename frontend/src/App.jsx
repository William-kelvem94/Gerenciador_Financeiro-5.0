import React, { useMemo, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // novo import
import TransactionsPage from './pages/TransactionsPage';
import AccountsPage from './pages/AccountsPage';
import CardsPage from './pages/CardsPage';
import BudgetsPage from './pages/BudgetsPage';
import GoalsPage from './pages/GoalsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import RecurringsPage from './pages/RecurringsPage';
import InvestmentsPage from './pages/InvestmentsPage';
import AssetsPage from './pages/AssetsPage';
import InsurancesPage from './pages/InsurancesPage';
import SharedExpensesPage from './pages/SharedExpensesPage';
import CustomReportsPage from './pages/CustomReportsPage';
import PaymentsPage from './pages/PaymentsPage';
import IntegrationsPage from './pages/IntegrationsPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPage from './pages/AdminPage';
import SettingsPage from './pages/SettingsPage';
import AIPage from './pages/AIPage';
import SmartReconciliationPage from './pages/SmartReconciliationPage';
import TaxReportsPage from './pages/TaxReportsPage';
import ERPExportPage from './pages/ERPExportPage';
import RealtimeDemoPage from './pages/RealtimeDemoPage';

function App() {
  // Suporte a tema escuro/claro
  const [mode, setMode] = useState('light');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#1976d2' },
          secondary: { main: '#009688' },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Botão de alternância de tema fixo no canto */}
      <IconButton
        sx={{ position: 'fixed', top: 8, right: 8, zIndex: 9999 }}
        color="inherit"
        onClick={() => setMode((prev) => (prev === 'light' ? 'dark' : 'light'))}
        aria-label="Alternar tema"
      >
        {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> {/* nova rota */}
        <Route path="/" element={<HomePage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/recurrings" element={<RecurringsPage />} />
        <Route path="/investments" element={<InvestmentsPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/insurances" element={<InsurancesPage />} />
        <Route path="/shared-expenses" element={<SharedExpensesPage />} />
        <Route path="/custom-reports" element={<CustomReportsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/smart-reconciliation" element={<SmartReconciliationPage />} />
        <Route path="/tax-reports" element={<TaxReportsPage />} />
        <Route path="/erp-export" element={<ERPExportPage />} />
        <Route path="/realtime-demo" element={<RealtimeDemoPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;

// A stack recomendada já está refletida neste App.jsx:
// - React (base do projeto)
// - Material UI (ThemeProvider, CssBaseline, componentes)
// - React Router (Routes, Route, Navigate)
// - Suporte a tema escuro/claro (Material UI)
// - As páginas podem usar Formik/Yup, Axios, Recharts, Socket.io-client, etc.
// - Para PWA, adicione service worker na raiz do projeto futuramente
// - Storybook e Jest/Testing Library podem ser configurados separadamente para UI e testes
