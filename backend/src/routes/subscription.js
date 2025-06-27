import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const subscription = await db.Subscription.create(req.body);
    res.status(201).json(subscription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const subscriptions = await db.Subscription.findAll({ where: { userId } });
  res.json(subscriptions);
});

// Cancelar assinatura
router.put('/cancel/:id', async (req, res) => {
  const { id } = req.params;
  await db.Subscription.update({ status: 'canceled' }, { where: { id } });
  const updated = await db.Subscription.findByPk(id);
  res.json(updated);
});

export default router;
