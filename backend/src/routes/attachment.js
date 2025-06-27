import express from 'express';
import multer from 'multer';
import db from '../models/index.js';
import path from 'path';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Upload de comprovante
router.post('/:transactionId', upload.single('file'), async (req, res) => {
  const { transactionId } = req.params;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Arquivo não enviado' });
  const attachment = await db.Attachment.create({
    transactionId,
    filename: file.originalname,
    url: file.path,
    mimetype: file.mimetype
  });
  res.status(201).json(attachment);
});

// Listar anexos de uma transação
router.get('/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  const attachments = await db.Attachment.findAll({ where: { transactionId } });
  res.json(attachments);
});

// Download de anexo
router.get('/download/:id', async (req, res) => {
  const { id } = req.params;
  const attachment = await db.Attachment.findByPk(id);
  if (!attachment) return res.status(404).json({ error: 'Anexo não encontrado' });
  res.download(path.resolve(attachment.url), attachment.filename);
});

export default router;
