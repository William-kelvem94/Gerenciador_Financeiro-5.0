import express from 'express';

const router = express.Router();

// Mock: criar evento em calendário externo
router.post('/event', async (req, res) => {
  const { title, date, description, calendarType } = req.body;
  // Aqui você integraria com Google Calendar, Outlook, etc.
  res.json({ status: 'Evento criado (simulado)', title, date, description, calendarType });
});

export default router;
