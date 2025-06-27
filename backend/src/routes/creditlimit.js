import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const credit = await db.CreditLimit.create(req.body);
    res.status(201).json(credit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const credit = await db.CreditLimit.findOne({ where: { userId } });
  res.json(credit);
});

// Atualizar score e alerta de risco
router.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  await db.CreditLimit.update(req.body, { where: { userId } });
  const updated = await db.CreditLimit.findOne({ where: { userId } });
  res.json(updated);
});

export default router;
