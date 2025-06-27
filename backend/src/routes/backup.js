import express from 'express';
import db from '../models/index.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Exportar backup completo (JSON)
router.get('/export', async (req, res) => {
  const data = {};
  for (const modelName of Object.keys(db)) {
    if (db[modelName].findAll) {
      data[modelName] = await db[modelName].findAll();
    }
  }
  const backupDir = 'uploads';
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  const backupFile = path.join(backupDir, `backup-${Date.now()}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
  res.download(backupFile, err => {
    if (err) {
      console.error("Erro ao baixar o arquivo de backup:", err);
    }
    // Garante que o arquivo seja removido após o download.
    fs.unlinkSync(backupFile);
  });
});

// Importar backup completo (JSON)
router.post('/import', async (req, res) => {
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: 'Backup inválido' });
  for (const modelName of Object.keys(data)) {
    if (db[modelName]?.bulkCreate) {
      await db[modelName].bulkCreate(data[modelName], { ignoreDuplicates: true });
    }
  }
  res.json({ status: 'Backup restaurado' });
});

export default router;
