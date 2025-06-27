import express from 'express';
import db from '../models/index.js';

const router = express.Router();

// Cálculo simples de imposto sobre investimentos (exemplo)
router.get('/investments', async (req, res) => {
  const { year } = req.query;
  const investments = await db.Investment.findAll({
    where: year ? { startDate: { [db.Sequelize.Op.like]: `${year}%` } } : undefined
  });
  // Exemplo: 15% sobre lucro fictício
  const report = investments.map(inv => ({
    name: inv.name,
    type: inv.type,
    value: inv.value,
    tax: (parseFloat(inv.value) * 0.15).toFixed(2)
  }));
  res.json(report);
});

// Relatório IRPF (mock)
router.get('/irpf', async (req, res) => {
  // Aqui você pode agregar dados de investimentos, rendimentos, bens, etc
  res.json({
    message: 'Relatório IRPF gerado (simulado)',
    data: {
      rendimentos: [],
      bens: [],
      investimentos: []
    }
  });
});

export default router;
