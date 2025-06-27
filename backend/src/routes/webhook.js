import express from 'express';
import axios from 'axios';

const router = express.Router();

// Registrar um webhook
let webhooks = []; // Em produção, use banco de dados

router.post('/register', (req, res) => {
  const { url, event } = req.body;
  webhooks.push({ url, event });
  res.json({ status: 'Webhook registrado', url, event });
});

// Disparar webhooks (função utilitária)
export async function triggerWebhooks(event, payload) {
  for (const wh of webhooks.filter(w => w.event === event)) {
    try {
      await axios.post(wh.url, payload);
    } catch (e) {
      console.error(`Erro ao enviar webhook para ${wh.url}:`, e.message);
    }
  }
}

export default router;
