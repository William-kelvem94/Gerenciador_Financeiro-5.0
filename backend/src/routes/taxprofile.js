import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const profile = await db.TaxProfile.create(req.body);
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const profiles = await db.TaxProfile.findAll({ where: { userId } });
  res.json(profiles);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  await db.TaxProfile.update(req.body, { where: { id } });
  const updated = await db.TaxProfile.findByPk(id);
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.TaxProfile.destroy({ where: { id } });
  res.status(204).send();
});

export default router;
