import express from 'express';
import db from '../models/index.js';

const router = express.Router();

// Exportar lançamentos para ERP (mock)
router.post('/export', async (req, res) => {
  const transactions = await db.Transaction.findAll();
  const exportData = transactions.map(t => ({
    date: t.date,
    description: t.description,
    value: t.value,
    type: t.type
  }));
  const erpExport = await db.ERPExport.create({ data: exportData, status: 'sent' });
  res.json({ status: 'Exportado', id: erpExport.id });
});

export default router;
