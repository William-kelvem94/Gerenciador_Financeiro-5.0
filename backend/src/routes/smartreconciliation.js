import express from 'express';
import db from '../models/index.js';

const router = express.Router();

// Sugestão automática de correspondência entre extratos e lançamentos
router.post('/suggest', async (req, res) => {
  const { extractLines } = req.body; // [{date, value, description}]
  // Exemplo: busca transações próximas por valor e data
  const suggestions = [];
  for (const line of extractLines) {
    const match = await db.Transaction.findOne({
      where: {
        value: line.value,
        date: line.date
      }
    });
    suggestions.push({
      extract: line,
      matchedTransaction: match
    });
  }
  res.json(suggestions);
});

export default router;
