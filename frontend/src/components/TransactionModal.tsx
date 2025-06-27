import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Chip,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  Close,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Category,
  CalendarToday,
  AccountBalance,
  Notes
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  editTransaction?: any;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  open,
  onClose,
  editTransaction
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    tipo: 'entrada',
    descricao: '',
    valor: '',
    categoria: '',
    conta: '',
    data: new Date(),
    observacao: ''
  });

  const categorias = {
    entrada: [
      'Salário',
      'Freelance',
      'Investimentos',
      'Vendas',
      'Prêmios',
      'Outros'
    ],
    saida: [
      'Alimentação',
      'Transporte',
      'Moradia',
      'Saúde',
      'Educação',
      'Lazer',
      'Compras',
      'Contas',
      'Outros'
    ]
  };

  const contas = [
    'Conta Corrente',
    'Conta Poupança',
    'Cartão de Crédito',
    'Cartão de Débito',
    'Dinheiro',
    'PIX'
  ];

  const handleSubmit = async () => {
    try {
      const transactionData = {
        ...formData,
        valor: parseFloat(formData.valor.replace(',', '.'))
      };

      const response = await fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
      });

      if (response.ok) {
        onClose();
        // Refresh dashboard
        window.dispatchEvent(new CustomEvent('dashboardUpdate'));
        // Reset form
        setFormData({
          tipo: 'entrada',
          descricao: '',
          valor: '',
          categoria: '',
          conta: '',
          data: new Date(),
          observacao: ''
        });
      }
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = (parseInt(numbers) / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatted;
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setFormData({ ...formData, valor: formatted });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              maxHeight: '90vh'
            }
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 2
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {editTransaction ? 'Editar Transação' : 'Nova Transação'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Adicione os detalhes da sua transação financeira
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Tipo da Transação */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Tipo da Transação
              </Typography>
              <ToggleButtonGroup
                value={formData.tipo}
                exclusive
                onChange={(_, value) => value && setFormData({ ...formData, tipo: value, categoria: '' })}
                fullWidth
                sx={{ mb: 2 }}
              >
                <ToggleButton
                  value="entrada"
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    border: `2px solid ${theme.palette.success.main}`,
                    color: formData.tipo === 'entrada' ? 'white' : theme.palette.success.main,
                    bgcolor: formData.tipo === 'entrada' ? theme.palette.success.main : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.success.main, 0.1)
                    }
                  }}
                >
                  <TrendingUp sx={{ mr: 1 }} />
                  Entrada
                </ToggleButton>
                <ToggleButton
                  value="saida"
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    border: `2px solid ${theme.palette.error.main}`,
                    color: formData.tipo === 'saida' ? 'white' : theme.palette.error.main,
                    bgcolor: formData.tipo === 'saida' ? theme.palette.error.main : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.error.main, 0.1)
                    }
                  }}
                >
                  <TrendingDown sx={{ mr: 1 }} />
                  Saída
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Descrição e Valor */}
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                fullWidth
                label="Descrição"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Notes color="action" />
                      </InputAdornment>
                    ),
                  }
                }}
                placeholder="Ex: Salário, Supermercado, Gasolina..."
                sx={{ flex: 2 }}
              />

              <TextField
                fullWidth
                label="Valor"
                value={formData.valor}
                onChange={handleValueChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney color="action" />
                      </InputAdornment>
                    ),
                  }
                }}
                placeholder="0,00"
                sx={{ flex: 1 }}
              />
            </Box>

            {/* Categoria e Conta */}
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={formData.categoria}
                  label="Categoria"
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  startAdornment={<Category color="action" sx={{ mr: 1 }} />}
                >
                  {categorias[formData.tipo as keyof typeof categorias].map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      <Chip
                        label={cat}
                        size="small"
                        color={formData.tipo === 'entrada' ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Conta</InputLabel>
                <Select
                  value={formData.conta}
                  label="Conta"
                  onChange={(e) => setFormData({ ...formData, conta: e.target.value })}
                  startAdornment={<AccountBalance color="action" sx={{ mr: 1 }} />}
                >
                  {contas.map((conta) => (
                    <MenuItem key={conta} value={conta}>
                      {conta}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Conta</InputLabel>
                <Select
                  value={formData.conta}
                  label="Conta"
                  onChange={(e) => setFormData({ ...formData, conta: e.target.value })}
                  startAdornment={<AccountBalance color="action" sx={{ mr: 1 }} />}
                >
                  {contas.map((conta) => (
                    <MenuItem key={conta} value={conta}>
                      <Chip
                        label={conta}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Data */}
            <Box>
              <DatePicker
                label="Data"
                value={formData.data}
                onChange={(newValue) => setFormData({ ...formData, data: newValue || new Date() })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    slotProps: {
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday color="action" />
                          </InputAdornment>
                        ),
                      }
                    }
                  }
                }}
              />
            </Box>

            {/* Observação */}
            <Box>
              <TextField
                fullWidth
                label="Observação (Opcional)"
                value={formData.observacao}
                onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                multiline
                rows={3}
                placeholder="Adicione detalhes adicionais sobre esta transação..."
              />
            </Box>

            {/* Resumo */}
            <Box>
              <Paper
                sx={{
                  p: 3,
                  bgcolor: alpha(
                    formData.tipo === 'entrada' 
                      ? theme.palette.success.main 
                      : theme.palette.error.main,
                    0.08
                  ),
                  border: `1px solid ${alpha(
                    formData.tipo === 'entrada' 
                      ? theme.palette.success.main 
                      : theme.palette.error.main,
                    0.2
                  )}`
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Resumo da Transação
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {formData.tipo === 'entrada' ? 'Entrada' : 'Saída'} • {formData.categoria || 'Categoria não selecionada'}
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {formData.descricao || 'Descrição não informada'}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color={formData.tipo === 'entrada' ? 'success.main' : 'error.main'}
                  >
                    {formData.tipo === 'entrada' ? '+' : '-'}R$ {formData.valor || '0,00'}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            size="large"
            sx={{ borderRadius: 2, px: 4 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            size="large"
            disabled={!formData.descricao || !formData.valor || !formData.categoria || !formData.conta}
            sx={{ borderRadius: 2, px: 4 }}
          >
            {editTransaction ? 'Atualizar' : 'Salvar'} Transação
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default TransactionModal;
