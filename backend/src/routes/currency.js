import express from 'express';
import db from '../models/index.js';

const router = express.Router();

// Criar moeda
router.post('/', async (req, res) => {
  try {
    const currency = await db.Currency.create(req.body);
    res.status(201).json(currency);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar moedas
router.get('/', async (req, res) => {
  const currencies = await db.Currency.findAll();
  res.json(currencies);
});

export default router;
