import express from 'express';
import multer from 'multer';
import csvParse from 'csv-parse';
import db from '../models/index.js';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/csv', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const transactions = [];
  fs.createReadStream(filePath)
    .pipe(csvParse({ columns: true, delimiter: ',' }))
    .on('data', (row) => {
      transactions.push(row);
    })
    .on('end', async () => {
      // Exemplo: importar cada linha como transação
      for (const t of transactions) {
        await db.Transaction.create({
          description: t.description,
          value: t.value,
          date: t.date,
          type: t.type,
          categoryId: t.categoryId,
          accountId: t.accountId
        });
      }
      fs.unlinkSync(filePath);
      res.json({ imported: transactions.length });
    });
});

export default router;
