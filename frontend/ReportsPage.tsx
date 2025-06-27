import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useRef, useState } from 'react';

interface Transaction {
  id: string;
  data: string;
  descricao: string;
  valor: number;
  tipo: string;
}

interface ImportFeedback {
  tipoDetectado: string;
  comoIdentificou: string;
  detalhes: string;
  total: number;
  preview: any[];
  salvos?: number;
  transacoes?: any[];
  erro?: string;
  duplicadas?: number;
}

function ReportsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [exporting, setExporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('Aguardando arquivo');
  const [importFeedback, setImportFeedback] = useState<ImportFeedback | null>(null);

  const feedbackColor = importStatus === 'success' ? '#388e3c' : importStatus === 'error' ? '#d32f2f' : '#1976d2';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportStatus('uploading');
      setImportMessage('Enviando arquivo...');
      setImportFeedback(null);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('http://localhost:3001/transactions/import', {
          method: 'POST',
          body: formData,
        });
        setImportStatus('processing');
        setImportMessage('Processando extrato...');
        const data = await res.json();
        setImportFeedback(data);
        if (res.ok && !data.erro) {
          // Atualiza lista de transações com o que está no banco
          const res2 = await fetch('http://localhost:3001/transactions');
          const txs = await res2.json();
          setTransactions(txs);
          setImportStatus('success');
          setImportMessage('Importação concluída!');
        } else {
          setImportStatus('error');
          setImportMessage('Erro ao importar extrato.' + (data.erro ? ' Motivo: ' + data.erro : ''));
        }
      } catch (err) {
        setImportStatus('error');
        setImportMessage('Erro ao importar extrato. ' + String(err));
      }
    }
  };

  const handleExport = async () => {
    setExporting(true);
    const res = await fetch('http://localhost:3001/transactions/export');
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'extrato.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } else {
      alert('Erro ao exportar extrato.');
    }
    setExporting(false);
  };

  return (
    <Box>
      {/* Caixa de status da importação */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: importStatus === 'success' ? '#e0ffe0' : importStatus === 'error' ? '#ffe0e0' : '#f5f5f5', borderLeft: `6px solid ${importStatus === 'success' ? '#4caf50' : importStatus === 'error' ? '#f44336' : '#2196f3'}` }}>
        <Typography variant="subtitle1" sx={{ color: feedbackColor }}>
          Status da Importação: {importMessage}
        </Typography>
        {importFeedback && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2"><b>Tipo detectado:</b> {importFeedback.tipoDetectado}</Typography>
            <Typography variant="body2"><b>Como identificou:</b> {importFeedback.comoIdentificou}</Typography>
            <Typography variant="body2"><b>Detalhes:</b> {importFeedback.detalhes}</Typography>
            <Typography variant="body2"><b>Total de transações encontradas:</b> {importFeedback.total}</Typography>
            <Typography variant="body2"><b>Transações ignoradas por duplicidade:</b> {importFeedback.duplicadas || 0}</Typography>
            {importFeedback.preview && importFeedback.preview.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2"><b>Preview das transações:</b></Typography>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {importFeedback.preview.map((tx) => (
                    <li key={tx.data + tx.descricao + tx.valor} style={{ fontSize: 13 }}>
                      {tx.data} | {tx.descricao} | {tx.valor?.toLocaleString?.('pt-BR', { style: 'currency', currency: 'BRL' }) || tx.valor} | {tx.tipo}
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Box>
        )}
      </Paper>
      <Typography variant="h4" gutterBottom>Relatórios</Typography>
      <Button variant="contained" onClick={() => fileInputRef.current?.click()} sx={{ mb: 2 }}>
        Importar Extrato Bancário
      </Button>
      <Button variant="outlined" onClick={handleExport} sx={{ mb: 2, ml: 2 }} disabled={exporting}>
        {exporting ? 'Exportando...' : 'Exportar Extrato do Sistema'}
      </Button>
      <input
        type="file"
        accept=".csv,.ofx,.txt"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {transactions.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Tipo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.data}</TableCell>
                  <TableCell>{tx.descricao}</TableCell>
                  <TableCell>{tx.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                  <TableCell>{tx.tipo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default ReportsPage;
