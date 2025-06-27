import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const logs = await db.AuditLog.findAll({ order: [['timestamp', 'DESC']], limit: 100 });
  res.json(logs);
});

export default router;
