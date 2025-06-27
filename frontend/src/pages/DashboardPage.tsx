import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  useTheme,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  AttachMoney,
  AccountBalance,
  Receipt,
  TrendingUp,
  MoreVert,
  Refresh,
} from '@mui/icons-material';

import { useDashboard } from '../hooks/useDashboard.js';
import StatCard from '../components/StatCard.js';
import RecentTransactions from '../components/RecentTransactions.js';
import CategoryChart from '../components/CategoryChart.js';
import MonthlyTrendChart from '../components/MonthlyTrendChart.js';
import QuickActions from '../components/QuickActions.js';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { data, loading, error, refresh } = useDashboard();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleRefresh = () => {
    refresh();
    setSnackbarOpen(true);
    handleMenuClose();
  };

  const handleAddTransaction = () => {
    // Implementar abertura do modal de transação
    navigate('/transacoes');
  };

  const handleViewTransactions = () => {
    navigate('/transacoes');
  };

  const handleViewReports = () => {
    navigate('/relatorios');
  };

  const handleOpenAI = () => {
    navigate('/ia');
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Erro ao carregar dashboard: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="textPrimary">
            Dashboard Financeiro
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Visão geral das suas finanças
          </Typography>
        </Box>
        
        <IconButton 
          onClick={handleMenuOpen}
          sx={{ 
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[2],
            '&:hover': { bgcolor: 'background.paper' }
          }}
        >
          <MoreVert />
        </IconButton>
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleRefresh}>
          <Refresh sx={{ mr: 2 }} />
          Atualizar
        </MenuItem>
      </Menu>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(4, 1fr)' 
        }, 
        gap: 3, 
        mb: 4 
      }}>
        <StatCard
          title="Saldo Total"
          value={data?.balance ?? 0}
          change={data?.balanceChange ?? 0}
          changePercent={data?.balanceChangePercent ?? 0}
          icon={<AccountBalance />}
          color={theme.palette.primary.main}
          loading={loading}
        />
        
        <StatCard
          title="Receitas"
          value={data?.totalIncome ?? 0}
          change={data?.incomeChange ?? 0}
          changePercent={data?.incomeChangePercent ?? 0}
          icon={<TrendingUp />}
          color={theme.palette.success.main}
          loading={loading}
        />
        
        <StatCard
          title="Despesas"
          value={data?.totalExpenses ?? 0}
          change={data?.expenseChange ?? 0}
          changePercent={data?.expenseChangePercent ?? 0}
          icon={<AttachMoney />}
          color={theme.palette.error.main}
          loading={loading}
        />
        
        <StatCard
          title="Transações"
          value={data?.totalTransactions ?? 0}
          change={data?.transactionChange ?? 0}
          changePercent={data?.transactionChangePercent ?? 0}
          icon={<Receipt />}
          color={theme.palette.warning.main}
          loading={loading}
        />
      </Box>

      {/* Quick Actions */}
      <Box mb={4}>
        <QuickActions
          onAddTransaction={handleAddTransaction}
          onViewTransactions={handleViewTransactions}
          onViewReports={handleViewReports}
          onOpenAI={handleOpenAI}
        />
      </Box>

      {/* Charts and Recent Transactions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <CategoryChart
            data={data?.categoryBreakdown || []}
            loading={loading}
          />
          
          <RecentTransactions
            transactions={data?.recentTransactions || []}
            loading={loading}
          />
        </Box>
        
        <MonthlyTrendChart
          data={data?.monthlyTrend || []}
          loading={loading}
        />
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Dashboard atualizado com sucesso!"
      />
    </Container>
  );
};

export default DashboardPage;
