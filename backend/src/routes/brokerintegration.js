import express from 'express';

const router = express.Router();

// Mock: importar extrato de investimentos
router.post('/import', async (req, res) => {
  // Aqui você integraria com APIs de corretoras
  res.json({ status: 'Extrato importado (simulado)' });
});

// Mock: atualizar cotações
router.get('/quotes', async (req, res) => {
  // Aqui você integraria com APIs de mercado
  res.json([
    { symbol: 'PETR4', price: 37.50 },
    { symbol: 'ITUB4', price: 28.10 }
  ]);
});

export default router;
