import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '5.0.0' });
});

// TODO: Adicionar rotas de transações, autenticação, orçamentos, etc.

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Will Finance 5.0 API rodando na porta ${PORT}`);
});
