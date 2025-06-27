import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const inheritance = await db.Inheritance.create(req.body);
    res.status(201).json(inheritance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const inheritances = await db.Inheritance.findAll();
  res.json(inheritances);
});

export default router;
