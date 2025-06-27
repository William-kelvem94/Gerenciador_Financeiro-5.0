import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const cashback = await db.Cashback.create(req.body);
    res.status(201).json(cashback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const cashbacks = await db.Cashback.findAll({ where: { userId } });
  res.json(cashbacks);
});

export default router;
