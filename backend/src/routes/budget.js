import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const budget = await db.Budget.create(req.body);
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const budgets = await db.Budget.findAll({ include: db.Category });
  res.json(budgets);
});

export default router;
