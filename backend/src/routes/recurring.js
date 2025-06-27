import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const recurring = await db.Recurring.create(req.body);
    res.status(201).json(recurring);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const rec = await db.Recurring.findAll();
  res.json(rec);
});

export default router;
