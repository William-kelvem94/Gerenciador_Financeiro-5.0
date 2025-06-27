import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const investment = await db.Investment.create(req.body);
    res.status(201).json(investment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const investments = await db.Investment.findAll();
  res.json(investments);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  await db.Investment.update(req.body, { where: { id } });
  const updated = await db.Investment.findByPk(id);
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.Investment.destroy({ where: { id } });
  res.status(204).send();
});

export default router;
