import express from 'express';
import db from '../models/index.js';

const router = express.Router();

// Salvar relatório customizado
router.post('/', async (req, res) => {
  const { userId, name, filters, columns } = req.body;
  const report = await db.CustomReport.create({ userId, name, filters, columns });
  res.status(201).json(report);
});

// Listar relatórios customizados do usuário
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const reports = await db.CustomReport.findAll({ where: { userId } });
  res.json(reports);
});

// Executar relatório customizado
router.post('/run/:id', async (req, res) => {
  const { id } = req.params;
  const report = await db.CustomReport.findByPk(id);
  if (!report) return res.status(404).json({ error: 'Relatório não encontrado' });
  // Exemplo: aplicar filtros em transações
  const where = report.filters || {};
  const data = await db.Transaction.findAll({ where, attributes: report.columns });
  res.json(data);
});

export default router;
