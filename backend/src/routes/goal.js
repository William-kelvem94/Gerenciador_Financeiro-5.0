import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const goal = await db.Goal.create(req.body);
    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const goals = await db.Goal.findAll();
  res.json(goals);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  await db.Goal.update(req.body, { where: { id } });
  const updated = await db.Goal.findByPk(id);
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.Goal.destroy({ where: { id } });
  res.status(204).send();
});

export default router;
