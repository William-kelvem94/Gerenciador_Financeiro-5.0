import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const API_URL = 'http://localhost:3000/transacoes';

function TransactionsPage() {
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({open: false, message: '', severity: 'success'});
  const [openClear, setOpenClear] = useState(false);
  const [transactions, setTransactions] = useState<Array<{id: number, descricao: string, valor: number}>>([]);
  
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Erro ao buscar transações');
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      setSnackbar({open: true, message: 'Erro ao buscar transações', severity: 'error'});
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await fetch(API_URL, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao limpar transações');
      setSnackbar({open: true, message: 'Todas as transações foram apagadas!', severity: 'success'});
      setOpenClear(false);
      fetchTransactions();
    } catch (err) {
      setSnackbar({open: true, message: 'Erro ao limpar transações', severity: 'error'});
      setOpenClear(false);
    }
  };

  return (
    <Box>
      <h1>Transações</h1>
      <form>
        <label htmlFor="descricao">Descrição</label>
        <input id="descricao" aria-label="Descrição" />
        <label htmlFor="valor">Valor</label>
        <input id="valor" aria-label="Valor" />
        <button type="submit">Adicionar</button>
      </form>
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
      <ul data-testid="transactions-list">
        {transactions.length === 0 ? (
          <li>Nenhuma transação encontrada</li>
        ) : (
          transactions.map(transacao => (
            <li key={transacao.id}>
              {transacao.descricao} - R$ {transacao.valor}
            </li>
          ))
        )}
      </ul>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert onClose={() => setSnackbar({...snackbar, open: false})} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TransactionsPage;
