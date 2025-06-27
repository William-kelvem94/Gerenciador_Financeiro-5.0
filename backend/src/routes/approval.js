import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const approval = await db.Approval.create(req.body);
    res.status(201).json(approval);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  await db.Approval.update(req.body, { where: { id } });
  const updated = await db.Approval.findByPk(id);
  res.json(updated);
});

router.get('/transaction/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  const approvals = await db.Approval.findAll({ where: { transactionId } });
  res.json(approvals);
});

export default router;
