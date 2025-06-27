import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Fab,
  Menu,
  MenuItem,
  Avatar,
  Button,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Add,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Category,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Refresh,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTransactions } from '../hooks/useTransactions.js';
import { Transaction } from '../types/index.js';
import { formatCurrency, formatDate, getCategoryColor, debounce } from '../utils/helpers.js';
import { DEFAULT_CATEGORIES } from '../utils/constants.js';
import TransactionModal from '../components/TransactionModal.js';

// Componente de Filtros
interface FiltersPanelProps {
  searchTerm: string;
  selectedCategory: string;
  selectedType: string;
  dateRange: { start: Date | null; end: Date | null };
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  onClearFilters: () => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  searchTerm,
  selectedCategory,
  selectedType,
  dateRange,
  onSearchChange,
  onCategoryChange,
  onTypeChange,
  onDateRangeChange,
  onClearFilters
}) => (
  <Card elevation={2} sx={{ mb: 3 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          Filtros
        </Typography>
        <Button size="small" onClick={onClearFilters}>
          Limpar Filtros
        </Button>
      </Box>
      
      <Box 
        display="flex" 
        flexWrap="wrap" 
        gap={2}
        alignItems="center"
      >
        <Box flex={1} minWidth={250}>
          <TextField
            fullWidth
            placeholder="Buscar transações..."
            value={searchTerm}
            label="Buscar"
            variant="outlined"
            size="small"
            onChange={(e) => onSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        
        <Box>
          <FormControl fullWidth size="small">
            <InputLabel>Categoria</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              label="Categoria"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">Todas</MenuItem>
              {DEFAULT_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>
          <FormControl fullWidth size="small">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              label="Tipo"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="receita">Receita</MenuItem>
              <MenuItem value="despesa">Despesa</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Data inicial"
            value={dateRange.start}
            onChange={(newValue) => onDateRangeChange({ ...dateRange, start: newValue })}
            slotProps={{
              textField: { size: 'small', sx: { minWidth: 140 } }
            }}
          />
          <DatePicker
            label="Data final"
            value={dateRange.end}
            onChange={(newValue) => onDateRangeChange({ ...dateRange, end: newValue })}
            slotProps={{
              textField: { size: 'small', sx: { minWidth: 140 } }
            }}
          />
        </LocalizationProvider>
      </Box>
    </CardContent>
  </Card>
);

// Componente de Estatísticas Rápidas
interface QuickStatsProps {
  data: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    count: number;
  };
  loading: boolean;
}

const QuickStats: React.FC<QuickStatsProps> = ({ data, loading }) => (
  <Box 
    display="flex" 
    flexWrap="wrap" 
    gap={2}
    sx={{ 
      mb: 3,
      '& > *': {
        flex: '1 1 200px',
        minWidth: 200
      }
    }}
  >
    <Card elevation={1}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
          <TrendingUp />
        </Avatar>
        {loading ? (
          <Skeleton variant="text" />
        ) : (
          <Typography variant="h6" color="success.main" fontWeight="bold">
            {formatCurrency(data.totalIncome)}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          Total de Receitas
        </Typography>
      </CardContent>
    </Card>

    <Card elevation={1}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', mb: 1 }}>
          <TrendingDown />
        </Avatar>
        {loading ? (
          <Skeleton variant="text" />
        ) : (
          <Typography variant="h6" color="error.main" fontWeight="bold">
            {formatCurrency(data.totalExpenses)}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          Total de Despesas
        </Typography>
      </CardContent>
    </Card>

    <Card elevation={1}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
          <AttachMoney />
        </Avatar>
        {loading ? (
          <Skeleton variant="text" />
        ) : (
          <Typography 
            variant="h6" 
            color={data.balance >= 0 ? 'success.main' : 'error.main'}
            fontWeight="bold"
          >
            {formatCurrency(data.balance)}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          Saldo Líquido
        </Typography>
      </CardContent>
    </Card>

    <Card elevation={1}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 1 }}>
          <Category />
        </Avatar>
        {loading ? (
          <Skeleton variant="text" />
        ) : (
          <Typography variant="h6" color="info.main" fontWeight="bold">
            {data.count}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          Total de Transações
        </Typography>
      </CardContent>
    </Card>
  </Box>
);

const TransactionsPage: React.FC = () => {
  const theme = useTheme();
  
  // Estado
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuTransaction, setMenuTransaction] = useState<Transaction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Hooks
  const { data, loading, error, refresh, deleteTransaction } = useTransactions(
    page + 1,
    rowsPerPage,
    {
      search: searchTerm,
      category: selectedCategory,
      type: selectedType,
      startDate: dateRange.start?.toISOString(),
      endDate: dateRange.end?.toISOString(),
    }
  );

  // Handlers
  const handleSearchChange = debounce((value: string) => {
    setSearchTerm(value);
    setPage(0);
  }, 500);

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setMenuTransaction(transaction);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (menuTransaction) {
      try {
        await deleteTransaction(menuTransaction.id);
        setDeleteDialogOpen(false);
        setMenuTransaction(null);
      } catch (error) {
        console.error('Erro ao deletar transação:', error);
      }
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, transaction: Transaction) => {
    setMenuAnchor(event.currentTarget);
    setMenuTransaction(transaction);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuTransaction(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedType('');
    setDateRange({ start: null, end: null });
    setPage(0);
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center">
          <Typography variant="h6" color="error" gutterBottom>
            Erro ao carregar transações
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {error}
          </Typography>
          <Button startIcon={<Refresh />} onClick={refresh} variant="contained">
            Tentar Novamente
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Transações
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie suas receitas e despesas
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Tooltip title="Filtros">
            <IconButton onClick={() => setShowFilters(!showFilters)}>
              <FilterList />
            </IconButton>
          </Tooltip>
          <Tooltip title="Atualizar">
            <IconButton onClick={refresh} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Estatísticas Rápidas */}
      <QuickStats 
        data={{
          totalIncome: data?.data?.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) ?? 0,
          totalExpenses: data?.data?.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) ?? 0,
          balance: (data?.data?.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) ?? 0) -
                   (data?.data?.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) ?? 0),
          count: data?.total ?? 0
        }}
        loading={loading}
      />

      {/* Filtros */}
      {showFilters && (
        <FiltersPanel
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          selectedType={selectedType}
          dateRange={dateRange}
          onSearchChange={handleSearchChange}
          onCategoryChange={setSelectedCategory}
          onTypeChange={setSelectedType}
          onDateRangeChange={setDateRange}
          onClearFilters={clearFilters}
        />
      )}

      {/* Tabela de Transações */}
      <Card elevation={2}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Conta</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: rowsPerPage }, (_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  data?.data?.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      hover
                      sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar 
                            sx={{ 
                              bgcolor: getCategoryColor(transaction.category),
                              width: 32,
                              height: 32,
                              mr: 2
                            }}
                          >
                            <Category fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {transaction.description}
                            </Typography>
                            {transaction.note && (
                              <Typography variant="caption" color="text.secondary">
                                {transaction.note}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(transaction.date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.category}
                          size="small"
                          sx={{
                            bgcolor: getCategoryColor(transaction.category) + '20',
                            color: getCategoryColor(transaction.category),
                            fontWeight: 'medium',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {transaction.account}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, transaction)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {data && (
            <TablePagination
              component="div"
              count={data.total}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Linhas por página:"
              labelDisplayedRows={({ from, to, count }) => {
                const total = count !== -1 ? count : `mais de ${to}`;
                return `${from}-${to} de ${total}`;
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* FAB */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={handleAddTransaction}
      >
        <Add />
      </Fab>

      {/* Modal de Transação */}
      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editTransaction={selectedTransaction}
      />

      {/* Menu de Ações */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditTransaction(menuTransaction!)}>
          <Edit sx={{ mr: 1 }} fontSize="small" />
          Editar
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(menuTransaction!)}>
          <Delete sx={{ mr: 1 }} fontSize="small" />
          Excluir
        </MenuItem>
      </Menu>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir a transação "{menuTransaction?.description}"?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TransactionsPage;
