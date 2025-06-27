import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const expense = await db.SharedExpense.create(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const expenses = await db.SharedExpense.findAll();
  res.json(expenses);
});

// Calcular saldo devido por usuário
router.get('/balance/:userId', async (req, res) => {
  const { userId } = req.params;
  const expenses = await db.SharedExpense.findAll();
  let balance = 0;
  for (const exp of expenses) {
    const part = (exp.participants || []).find(p => p.userId == userId);
    if (part) {
      if (exp.payerId == userId) {
        balance += parseFloat(exp.totalValue) - parseFloat(part.share);
      } else {
        balance -= parseFloat(part.share);
      }
    }
  }
  res.json({ userId, balance });
});

export default router;
