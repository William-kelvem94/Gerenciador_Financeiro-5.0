import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const insurance = await db.Insurance.create(req.body);
    res.status(201).json(insurance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const insurances = await db.Insurance.findAll({ where: { userId } });
  res.json(insurances);
});

export default router;
