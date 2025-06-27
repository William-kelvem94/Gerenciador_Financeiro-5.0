import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const debt = await db.Debt.create(req.body);
    res.status(201).json(debt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const debts = await db.Debt.findAll();
  res.json(debts);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  await db.Debt.update(req.body, { where: { id } });
  const updated = await db.Debt.findByPk(id);
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.Debt.destroy({ where: { id } });
  res.status(204).send();
});

export default router;
