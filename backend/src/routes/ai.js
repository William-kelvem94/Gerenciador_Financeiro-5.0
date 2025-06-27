import express from 'express';

const router = express.Router();

// Sugestão de categoria para uma transação (mock IA)
router.post('/suggest-category', async (req, res) => {
  const { description } = req.body;
  // Aqui você integraria com uma API de IA real
  // Exemplo simples:
  let suggestion = 'Outros';
  if (/supermercado|mercado|compras/i.test(description)) suggestion = 'Alimentação';
  if (/luz|energia|água|conta/i.test(description)) suggestion = 'Despesas Fixas';
  if (/uber|transporte|ônibus/i.test(description)) suggestion = 'Transporte';
  res.json({ suggestedCategory: suggestion });
});

export default router;
