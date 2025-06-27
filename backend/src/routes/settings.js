import express from 'express';
import db from '../models/index.js';

const router = express.Router();

// Buscar configurações
router.get('/', async (req, res) => {
  let settings = await db.Settings.findOne();
  if (!settings) {
    settings = await db.Settings.create({});
  }
  res.json(settings);
});

// Atualizar configurações
router.put('/', async (req, res) => {
  let settings = await db.Settings.findOne();
  if (!settings) {
    settings = await db.Settings.create({});
  }
  await settings.update(req.body);
  res.json(settings);
});

export default router;

// Nenhuma alteração necessária, pois já aceita qualquer campo do modelo Settings
