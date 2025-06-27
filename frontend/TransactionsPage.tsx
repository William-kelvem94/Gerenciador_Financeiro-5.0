import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const categorias = [
  'Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Salário', 'Investimento', 'Saúde', 'Educação', 'Outros',
];
const tipos = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'saida', label: 'Saída' },
];

const API_URL = 'http://localhost:3001/transactions';

type Transaction = {
  id?: number;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  tipo: 'entrada' | 'saida';
  conta: string;
  observacao?: string;
};

const initialForm: Transaction = {
  descricao: '',
  valor: 0,
  data: '',
  categoria: '',
  tipo: 'entrada',
  conta: '',
  observacao: '',
};

function TransactionsPage() {
  const [form, setForm] = useState<Transaction>(initialForm);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openClear, setOpenClear] = useState(false);
  const [openDelete, setOpenDelete] = useState<{open: boolean, id: number | null}>({open: false, id: null});

  const fetchTransactions = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTransactions(data);
    window.dispatchEvent(new Event('dashboardUpdate'));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setEditingId(null);
    } else {
      // Checa duplicidade antes de cadastrar
      const exists = transactions.find(t =>
        t.data === form.data &&
        Number(t.valor) === Number(form.valor) &&
        t.descricao.trim() === form.descricao.trim() &&
        t.conta.trim() === form.conta.trim()
      );
      if (exists) {
        alert('Já existe uma transação igual cadastrada!');
        return;
      }
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm(initialForm);
    fetchTransactions();
  };

  const handleEdit = (t: Transaction) => {
    setForm({ ...t });
    setEditingId(t.id!);
  };

  const handleClearAll = async () => {
    await fetch(API_URL, { method: 'DELETE' });
    setOpenClear(false);
    fetchTransactions();
  };

  const handleDelete = (id: number) => {
    setOpenDelete({open: true, id});
  };

  const confirmDelete = async () => {
    if (openDelete.id !== null) {
      await fetch(`${API_URL}/${openDelete.id}`, { method: 'DELETE' });
      setOpenDelete({open: false, id: null});
      fetchTransactions();
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Transações</Typography>
      <Button variant="outlined" color="error" startIcon={<DeleteSweepIcon />} sx={{ mb: 2 }} onClick={() => setOpenClear(true)}>
        Limpar Todas
      </Button>
      <Dialog open={openClear} onClose={() => setOpenClear(false)}>
        <DialogTitle>Limpar todas as transações?</DialogTitle>
        <DialogContent>Esta ação é irreversível. Tem certeza que deseja apagar todas as transações?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenClear(false)}>Cancelar</Button>
          <Button color="error" onClick={handleClearAll}>Limpar Tudo</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDelete.open} onClose={() => setOpenDelete({open: false, id: null})}>
        <DialogTitle>Excluir transação?</DialogTitle>
        <DialogContent>Tem certeza que deseja excluir esta transação?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete({open: false, id: null})}>Cancelar</Button>
          <Button color="error" onClick={confirmDelete}>Excluir</Button>
        </DialogActions>
      </Dialog>
      <Paper sx={{ p: 2, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Descrição" name="descricao" value={form.descricao} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField label="Valor" name="valor" type="number" value={form.valor} onChange={handleChange} fullWidth required inputProps={{ step: 0.01 }} />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField label="Data" name="data" type="date" value={form.data} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField select label="Categoria" name="categoria" value={form.categoria} onChange={handleChange} fullWidth required>
                {categorias.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField select label="Tipo" name="tipo" value={form.tipo} onChange={handleChange} fullWidth required>
                {tipos.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField label="Conta" name="conta" value={form.conta} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Observação" name="observacao" value={form.observacao} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ height: '100%' }}>
                {editingId ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </Grid>
            {editingId && (
              <Grid item xs={12} md={2}>
                <Button variant="outlined" color="secondary" fullWidth sx={{ height: '100%' }} onClick={() => { setForm(initialForm); setEditingId(null); }}>
                  Cancelar
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
      <Typography variant="h6" gutterBottom>Transações Cadastradas</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descrição</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Conta</TableCell>
              <TableCell>Observação</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.descricao}</TableCell>
                <TableCell>{Number(t.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                <TableCell>{t.data}</TableCell>
                <TableCell>{t.categoria}</TableCell>
                <TableCell>{t.tipo === 'entrada' ? 'Entrada' : 'Saída'}</TableCell>
                <TableCell>{t.conta}</TableCell>
                <TableCell>{t.observacao}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(t)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(t.id!)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TransactionsPage;
