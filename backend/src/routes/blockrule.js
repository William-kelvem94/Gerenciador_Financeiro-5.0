import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const rule = await db.BlockRule.create(req.body);
    res.status(201).json(rule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const rules = await db.BlockRule.findAll();
  res.json(rules);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  await db.BlockRule.update(req.body, { where: { id } });
  const updated = await db.BlockRule.findByPk(id);
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.BlockRule.destroy({ where: { id } });
  res.status(204).send();
});

export default router;
