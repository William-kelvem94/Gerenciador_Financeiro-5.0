import express from 'express';
import db from '../models/index.js';

const router = express.Router();

// Exemplo simples: lista transações não conciliadas
router.get('/unmatched', async (req, res) => {
  // Aqui você pode implementar lógica para comparar transações do banco com extratos importados
  // Exemplo: buscar transações sem correspondência em extratos
  const unmatched = await db.Transaction.findAll({
    where: { reconciled: false }
  });
  res.json(unmatched);
});

export default router;
