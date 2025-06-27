import express from 'express';

const router = express.Router();

// Simulação de saldo futuro
router.post('/balance', (req, res) => {
  const { initial, monthly, months } = req.body;
  let saldo = parseFloat(initial);
  const projection = [];
  for (let i = 1; i <= months; i++) {
    saldo += parseFloat(monthly);
    projection.push({ month: i, saldo: saldo.toFixed(2) });
  }
  res.json(projection);
});

// Simulação de empréstimo
router.post('/loan', (req, res) => {
  const { principal, rate, months } = req.body;
  const monthlyRate = parseFloat(rate) / 100 / 12;
  const n = parseInt(months);
  const p = parseFloat(principal);
  const installment = (p * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
  res.json({ installment: installment.toFixed(2), total: (installment * n).toFixed(2) });
});

export default router;
