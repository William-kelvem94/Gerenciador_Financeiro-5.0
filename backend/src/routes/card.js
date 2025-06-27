import express from 'express';
import db from '../models/index.js';

const router = express.Router();

// Criar cartão
router.post('/', async (req, res) => {
  try {
    const card = await db.Card.create(req.body);
    res.status(201).json(card);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar cartões
router.get('/', async (req, res) => {
  const cards = await db.Card.findAll();
  res.json(cards);
});

// Consultar fatura atual
router.get('/:id/invoice', async (req, res) => {
  const { id } = req.params;
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const transactions = await db.Transaction.findAll({
    where: {
      cardId: id,
      date: {
        [db.Sequelize.Op.between]: [`${year}-${month}-01`, `${year}-${month}-31`]
      }
    }
  });
  res.json(transactions);
});

export default router;
