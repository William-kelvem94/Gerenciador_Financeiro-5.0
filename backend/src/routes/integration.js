import express from 'express';

const router = express.Router();

// Endpoint público para integrações externas (exemplo)
router.post('/webhook', (req, res) => {
  // Processar dados recebidos de integrações externas
  res.json({ status: 'Recebido' });
});

// Endpoint para simular leitura de extrato via Open Finance (mock)
router.get('/open-finance/extract', (req, res) => {
  // Aqui você integraria com APIs reais de bancos
  res.json([
    { date: '2024-06-01', description: 'PIX recebido', value: 1000, type: 'entrada' },
    { date: '2024-06-02', description: 'Compra cartão', value: -200, type: 'saida' }
  ]);
});

export default router;
