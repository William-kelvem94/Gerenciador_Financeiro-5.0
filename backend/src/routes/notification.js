import express from 'express';

const router = express.Router();

// Enviar notificação (mock)
router.post('/send', async (req, res) => {
  const { to, subject, type } = req.body;
  // Aqui você integraria com serviço de e-mail, push, etc.
  res.json({ status: 'Notificação enviada (simulado)', to, subject, type });
});

// Listar notificações (mock)
router.get('/', async (req, res) => {
  res.json([
    { id: 1, type: 'email', subject: 'Lembrete de vencimento', sentAt: '2024-06-01' }
  ]);
});

export default router;
