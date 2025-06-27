import { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  Fab,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Skeleton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Receipt as TransactionsIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Psychology as AiIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Brightness4,
  Brightness7,
  Notifications,
  Search
} from '@mui/icons-material';
import { Routes, Route, useLocation } from 'react-router-dom';

// Components
import DashboardPage from './pages/DashboardPage.js';
import TransactionsPage from './pages/TransactionsPage.js';
import ReportsPage from './pages/ReportsPage.js';
import SettingsPage from './pages/SettingsPage.js';
import AiPage from './pages/AiPage.js';
import Sidebar from './components/Sidebar.js';
import TransactionModal from './components/TransactionModal.js';

// Theme
const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#2563eb' : '#3b82f6',
      light: mode === 'light' ? '#60a5fa' : '#93c5fd',
      dark: mode === 'light' ? '#1d4ed8' : '#1e40af',
    },
    secondary: {
      main: mode === 'light' ? '#10b981' : '#34d399',
    },
    background: {
      default: mode === 'light' ? '#f8fafc' : '#0f172a',
      paper: mode === 'light' ? '#ffffff' : '#1e293b',
    },
    text: {
      primary: mode === 'light' ? '#1e293b' : '#f1f5f9',
      secondary: mode === 'light' ? '#64748b' : '#94a3b8',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' 
            ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
            : '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
        }
      }
    }
  }
});

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:768px)');
  const theme = getTheme(darkMode ? 'dark' : 'light');

  // Detectar preferência do sistema
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
    
    // Simular carregamento inicial
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Menu items
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/', color: '#3b82f6' },
    { text: 'Transações', icon: <TransactionsIcon />, path: '/transacoes', color: '#10b981' },
    { text: 'Relatórios', icon: <ReportsIcon />, path: '/relatorios', color: '#f59e0b' },
    { text: 'IA Financeira', icon: <AiIcon />, path: '/ia', color: '#8b5cf6' },
    { text: 'Configurações', icon: <SettingsIcon />, path: '/configuracoes', color: '#6b7280' },
  ];

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem?.text ?? 'Dashboard';
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
          <Box sx={{ width: 280, p: 2 }}>
            <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 2 }} />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={`skeleton-loading-${i + 1}`} variant="rectangular" height={48} sx={{ mb: 1, borderRadius: 1 }} />
            ))}
          </Box>
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Skeleton variant="rectangular" height={64} sx={{ mb: 3, borderRadius: 2 }} />
            <Box 
              display="flex" 
              flexWrap="wrap" 
              gap={3}
              sx={{ 
                '& > *': { 
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(25% - 18px)' }
                }
              }}
            >
              {Array.from({ length: 4 }, (_, i: number) => (
                <Skeleton key={`loading-card-${i + 1}`} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
              ))}
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        
        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          menuItems={menuItems}
          currentPath={location.pathname}
          isMobile={isMobile}
        />

        {/* Main Content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            ml: sidebarOpen && !isMobile ? '280px' : 0,
            transition: 'margin 0.3s ease'
          }}
        >
          {/* Top AppBar */}
          <AppBar 
            position="sticky" 
            elevation={0}
            sx={{ 
              bgcolor: 'background.paper',
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
                  {getCurrentPageTitle()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                
                <IconButton color="inherit">
                  <Search />
                </IconButton>
                
                <IconButton color="inherit">
                  <Notifications />
                </IconButton>

                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          {/* User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => setAnchorEl(null)}>
              <PersonIcon sx={{ mr: 2 }} />
              Perfil
            </MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}>
              <SettingsIcon sx={{ mr: 2 }} />
              Configurações
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => setAnchorEl(null)}>
              Sair
            </MenuItem>
          </Menu>

          {/* Page Content */}
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/transacoes" element={<TransactionsPage />} />
              <Route path="/relatorios" element={<ReportsPage />} />
              <Route path="/ia" element={<AiPage />} />
              <Route path="/configuracoes" element={<SettingsPage />} />
            </Routes>
          </Container>

          {/* FAB para adicionar transação */}
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000
            }}
            onClick={() => setTransactionModalOpen(true)}
          >
            <AddIcon />
          </Fab>
        </Box>

        {/* Modal de Nova Transação */}
        <TransactionModal
          open={transactionModalOpen}
          onClose={() => setTransactionModalOpen(false)}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
