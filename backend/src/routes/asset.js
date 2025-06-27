import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const asset = await db.Asset.create(req.body);
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const assets = await db.Asset.findAll();
  res.json(assets);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  await db.Asset.update(req.body, { where: { id } });
  const updated = await db.Asset.findByPk(id);
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.Asset.destroy({ where: { id } });
  res.status(204).send();
});

export default router;
