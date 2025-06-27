import express from 'express';
import multer from 'multer';
// Exemplo com tesseract.js para OCR local (pode ser substituído por API externa)
import Tesseract from 'tesseract.js';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/comprovante', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Arquivo não enviado' });

  try {
    const { data: { text } } = await Tesseract.recognize(file.path, 'por');
    // Aqui você pode aplicar regex para extrair valor, data, etc do texto
    // Exemplo simples:
    const valueMatch = text.match(/R?\$ ?([\d.,]+)/i);
    const value = valueMatch ? valueMatch[1] : null;
    fs.unlinkSync(file.path);
    res.json({ ocrText: text, value });
  } catch (err) {
    res.status(500).json({ error: 'Erro no OCR', details: err.message });
  }
});

export default router;
