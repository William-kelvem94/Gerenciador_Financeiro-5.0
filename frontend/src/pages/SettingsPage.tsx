import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  useTheme,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Person,
  Notifications,
  Security,
  Palette,
  Language,
  AttachMoney,
  Category,
  AccountBalance,
  Backup,
  Download,
  Upload,
  Delete,
  Edit,
  Add,
  Save,
  Cancel,
  PhotoCamera,
  Brightness4,
  Brightness7,
  VolumeUp,
  Email,
  Smartphone,
} from '@mui/icons-material';
import { formatCurrency, getCategoryColor } from '../utils/helpers.js';
import { 
  DEFAULT_CATEGORIES, 
  DEFAULT_ACCOUNTS, 
  SUPPORTED_CURRENCIES, 
  SUPPORTED_LANGUAGES,
  AVAILABLE_THEMES 
} from '../utils/constants.js';

const SettingsPage: React.FC = () => {
  const theme = useTheme();
  
  // Estados
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    avatar: '',
  });
  
  const [preferences, setPreferences] = useState({
    theme: 'light',
    currency: 'BRL',
    language: 'pt',
    notifications: {
      budget: true,
      goals: true,
      transactions: true,
      email: true,
      push: false,
    },
    dashboard: {
      showBalance: true,
      defaultPeriod: 'month',
    },
  });

  const [categories, setCategories] = useState([
    ...DEFAULT_CATEGORIES.income.map(cat => ({ ...cat, type: 'income' as const })),
    ...DEFAULT_CATEGORIES.expense.map(cat => ({ ...cat, type: 'expense' as const })),
  ]);
  
  const [accounts, setAccounts] = useState(DEFAULT_ACCOUNTS);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<'category' | 'account' | null>(null);

  // Handlers
  const handleSave = (section: string) => {
    setSnackbar({ open: true, message: `${section} salvo com sucesso!`, severity: 'success' });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, avatar: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportData = () => {
    const data = {
      profile: profileData,
      preferences,
      categories,
      accounts,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gerenciador-financeiro-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    
    setSnackbar({ open: true, message: 'Dados exportados com sucesso!', severity: 'success' });
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.profile) setProfileData(data.profile);
          if (data.preferences) setPreferences(data.preferences);
          if (data.categories) setCategories(data.categories);
          if (data.accounts) setAccounts(data.accounts);
          setSnackbar({ open: true, message: 'Dados importados com sucesso!', severity: 'success' });
        } catch (error) {
          setSnackbar({ open: true, message: 'Erro ao importar dados!', severity: 'error' });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleEditItem = (item: any, type: 'category' | 'account') => {
    setEditingItem(item);
    setEditingType(type);
    setDialogOpen(true);
  };

  const handleDeleteItem = (id: number, type: 'category' | 'account') => {
    if (type === 'category') {
      setCategories(prev => prev.filter(cat => cat.name !== categories[id].name));
    } else {
      setAccounts(prev => prev.filter((_, index) => index !== id));
    }
    setSnackbar({ open: true, message: `${type === 'category' ? 'Categoria' : 'Conta'} removida com sucesso!`, severity: 'success' });
  };

  // Componente de navegação das abas
  const TabNavigation = () => (
    <Paper elevation={2} sx={{ mb: 3 }}>
      <List component="nav">
        {[
          { id: 'profile', label: 'Perfil', icon: <Person /> },
          { id: 'preferences', label: 'Preferências', icon: <Palette /> },
          { id: 'notifications', label: 'Notificações', icon: <Notifications /> },
          { id: 'categories', label: 'Categorias', icon: <Category /> },
          { id: 'accounts', label: 'Contas', icon: <AccountBalance /> },
          { id: 'backup', label: 'Backup', icon: <Backup /> },
        ].map((tab) => (
          <ListItem
            key={tab.id}
            button
            selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            sx={{
              '&.Mui-selected': {
                bgcolor: theme.palette.primary.main + '15',
                borderRight: `3px solid ${theme.palette.primary.main}`,
              },
            }}
          >
            <ListItemIcon sx={{ color: activeTab === tab.id ? theme.palette.primary.main : 'inherit' }}>
              {tab.icon}
            </ListItemIcon>
            <ListItemText
              primary={tab.label}
              sx={{ color: activeTab === tab.id ? theme.palette.primary.main : 'inherit' }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  // Seção de Perfil
  const ProfileSection = () => (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Informações do Perfil
        </Typography>
        
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            src={profileData.avatar}
            sx={{ width: 80, height: 80, mr: 3 }}
          >
            {profileData.name.charAt(0)}
          </Avatar>
          <Box>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="avatar-upload">
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
            <Typography variant="body2" color="text.secondary">
              Clique para alterar a foto
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nome Completo"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="E-mail"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Telefone"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => handleSave('Perfil')}
          >
            Salvar Perfil
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  // Seção de Preferências
  const PreferencesSection = () => (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Preferências do Sistema
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Tema</InputLabel>
              <Select
                value={preferences.theme}
                onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                label="Tema"
              >
                {AVAILABLE_THEMES.map((theme) => (
                  <MenuItem key={theme.value} value={theme.value}>
                    <Box display="flex" alignItems="center">
                      {theme.value === 'light' ? <Brightness7 sx={{ mr: 1 }} /> : 
                       theme.value === 'dark' ? <Brightness4 sx={{ mr: 1 }} /> : 
                       <Palette sx={{ mr: 1 }} />}
                      {theme.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Moeda</InputLabel>
              <Select
                value={preferences.currency}
                onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
                label="Moeda"
              >
                {SUPPORTED_CURRENCIES.map((currency) => (
                  <MenuItem key={currency.code} value={currency.code}>
                    <Box display="flex" alignItems="center">
                      <AttachMoney sx={{ mr: 1 }} />
                      {currency.symbol} - {currency.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Idioma</InputLabel>
              <Select
                value={preferences.language}
                onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                label="Idioma"
              >
                {SUPPORTED_LANGUAGES.map((language) => (
                  <MenuItem key={language.code} value={language.code}>
                    <Box display="flex" alignItems="center">
                      <Language sx={{ mr: 1 }} />
                      {language.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Período Padrão do Dashboard</InputLabel>
              <Select
                value={preferences.dashboard.defaultPeriod}
                onChange={(e) => setPreferences(prev => ({ 
                  ...prev, 
                  dashboard: { ...prev.dashboard, defaultPeriod: e.target.value }
                }))}
                label="Período Padrão do Dashboard"
              >
                <MenuItem value="week">Semana</MenuItem>
                <MenuItem value="month">Mês</MenuItem>
                <MenuItem value="quarter">Trimestre</MenuItem>
                <MenuItem value="year">Ano</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box mt={3}>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.dashboard.showBalance}
                onChange={(e) => setPreferences(prev => ({ 
                  ...prev, 
                  dashboard: { ...prev.dashboard, showBalance: e.target.checked }
                }))}
              />
            }
            label="Mostrar saldo no dashboard"
          />
        </Box>

        <Box mt={3}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => handleSave('Preferências')}
          >
            Salvar Preferências
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  // Seção de Notificações
  const NotificationsSection = () => (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Configurações de Notificação
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <AttachMoney />
            </ListItemIcon>
            <ListItemText
              primary="Alertas de Orçamento"
              secondary="Receber notificações quando ultrapassar o orçamento"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={preferences.notifications.budget}
                onChange={(e) => setPreferences(prev => ({ 
                  ...prev, 
                  notifications: { ...prev.notifications, budget: e.target.checked }
                }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <Category />
            </ListItemIcon>
            <ListItemText
              primary="Metas Financeiras"
              secondary="Notificações sobre o progresso das suas metas"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={preferences.notifications.goals}
                onChange={(e) => setPreferences(prev => ({ 
                  ...prev, 
                  notifications: { ...prev.notifications, goals: e.target.checked }
                }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <Notifications />
            </ListItemIcon>
            <ListItemText
              primary="Transações"
              secondary="Notificações sobre novas transações"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={preferences.notifications.transactions}
                onChange={(e) => setPreferences(prev => ({ 
                  ...prev, 
                  notifications: { ...prev.notifications, transactions: e.target.checked }
                }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <Email />
            </ListItemIcon>
            <ListItemText
              primary="Notificações por E-mail"
              secondary="Receber notificações via e-mail"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={preferences.notifications.email}
                onChange={(e) => setPreferences(prev => ({ 
                  ...prev, 
                  notifications: { ...prev.notifications, email: e.target.checked }
                }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <Smartphone />
            </ListItemIcon>
            <ListItemText
              primary="Notificações Push"
              secondary="Receber notificações push no navegador"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={preferences.notifications.push}
                onChange={(e) => setPreferences(prev => ({ 
                  ...prev, 
                  notifications: { ...prev.notifications, push: e.target.checked }
                }))}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        <Box mt={3}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => handleSave('Notificações')}
          >
            Salvar Notificações
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  // Seção de Categorias
  const CategoriesSection = () => (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">
            Gerenciar Categorias
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleEditItem(null, 'category')}
          >
            Nova Categoria
          </Button>
        </Box>

        <Grid container spacing={2}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  border: `2px solid ${category.color}20`,
                  '&:hover': { elevation: 3 },
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: category.color, mr: 2, width: 32, height: 32 }}>
                      <Category fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {category.name}
                      </Typography>
                      <Chip
                        label={category.type === 'income' ? 'Receita' : 'Despesa'}
                        size="small"
                        color={category.type === 'income' ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={() => handleEditItem(category, 'category')}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteItem(index, 'category')}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  // Seção de Contas
  const AccountsSection = () => (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">
            Gerenciar Contas
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleEditItem(null, 'account')}
          >
            Nova Conta
          </Button>
        </Box>

        <Grid container spacing={2}>
          {accounts.map((account, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  border: `2px solid ${account.color}20`,
                  '&:hover': { elevation: 3 },
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: account.color, mr: 2, width: 32, height: 32 }}>
                      <AccountBalance fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {account.name}
                      </Typography>
                      <Chip
                        label={account.type}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={() => handleEditItem(account, 'account')}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteItem(index, 'account')}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  // Seção de Backup
  const BackupSection = () => (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Backup e Restauração
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Download sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h6" mb={1}>
                Exportar Dados
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Faça backup de todos os seus dados financeiros
              </Typography>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleExportData}
              >
                Exportar
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Upload sx={{ fontSize: 48, color: theme.palette.secondary.main, mb: 2 }} />
              <Typography variant="h6" mb={1}>
                Importar Dados
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Restaure seus dados de um arquivo de backup
              </Typography>
              <input
                accept=".json"
                style={{ display: 'none' }}
                id="import-data"
                type="file"
                onChange={handleImportData}
              />
              <label htmlFor="import-data">
                <Button
                  variant="outlined"
                  startIcon={<Upload />}
                  component="span"
                >
                  Importar
                </Button>
              </label>
            </Paper>
          </Grid>
        </Grid>

        <Alert severity="info" sx={{ mt: 2 }}>
          <strong>Importante:</strong> Mantenha backups regulares dos seus dados. 
          O arquivo de backup contém todas as suas informações financeiras.
        </Alert>
      </CardContent>
    </Card>
  );

  // Renderizar seção ativa
  const renderActiveSection = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'preferences':
        return <PreferencesSection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'categories':
        return <CategoriesSection />;
      case 'accounts':
        return <AccountsSection />;
      case 'backup':
        return <BackupSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Configurações
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Personalize sua experiência no Gerenciador Financeiro
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Navegação */}
        <Grid item xs={12} md={3}>
          <TabNavigation />
        </Grid>

        {/* Conteúdo */}
        <Grid item xs={12} md={9}>
          {renderActiveSection()}
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage;
