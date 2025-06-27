import express from 'express';
import db from '../models/index.js';
import { triggerWebhooks } from './webhook.js';

const router = express.Router();

// Criar transação
router.post('/', async (req, res) => {
  try {
    const {
      description, value, date, type, categoryId, accountId,
      goalType, goalValue, bankName, extra
    } = req.body;
    // Verifica bloqueio por categoria
    const categoryRules = await db.BlockRule.findAll({
      where: { type: 'category', referenceId: categoryId, active: true }
    });
    for (const rule of categoryRules) {
      const total = await db.Transaction.sum('value', {
        where: {
          categoryId,
          date: { [db.Sequelize.Op.like]: `${rule.period}%` }
        }
      });
      if (parseFloat(total || 0) + parseFloat(value) > parseFloat(rule.limit)) {
        return res.status(403).json({ error: 'Limite de gasto por categoria atingido' });
      }
    }
    // Verifica bloqueio por conta
    const accountRules = await db.BlockRule.findAll({
      where: { type: 'account', referenceId: accountId, active: true }
    });
    for (const rule of accountRules) {
      const total = await db.Transaction.sum('value', {
        where: {
          accountId,
          date: { [db.Sequelize.Op.like]: `${rule.period}%` }
        }
      });
      if (parseFloat(total || 0) + parseFloat(value) > parseFloat(rule.limit)) {
        return res.status(403).json({ error: 'Limite de gasto por conta atingido' });
      }
    }
    const transaction = await db.Transaction.create({
      description, value, date, type, categoryId, accountId,
      goalType, goalValue, bankName, extra
    });
    // Disparar webhook de nova transação
    await triggerWebhooks('transaction_created', transaction);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar transações
router.get('/', async (req, res) => {
  try {
    const transactions = await db.Transaction.findAll();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar transação
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.Transaction.update(req.body, { where: { id } });
    const updated = await db.Transaction.findByPk(id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar transação
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.Transaction.destroy({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
