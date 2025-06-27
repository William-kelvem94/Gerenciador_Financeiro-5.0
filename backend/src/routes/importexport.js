import express from 'express';
import multer from 'multer';
import csvParse from 'csv-parse';
import db from '../models/index.js';
import fs from 'fs';
import ExcelJS from 'exceljs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Importar CSV
router.post('/import/csv', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const transactions = [];
  fs.createReadStream(filePath)
    .pipe(csvParse({ columns: true, delimiter: ',' }))
    .on('data', (row) => {
      transactions.push(row);
    })
    .on('end', async () => {
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

// Exportar transações para Excel
router.get('/export/excel', async (req, res) => {
  const transactions = await db.Transaction.findAll();
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Transações');
  sheet.addRow(['Data', 'Descrição', 'Valor', 'Tipo', 'Categoria', 'Conta']);
  transactions.forEach(t => {
    sheet.addRow([
      t.date,
      t.description,
      t.value,
      t.type,
      t.categoryId,
      t.accountId
    ]);
  });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=transacoes.xlsx');
  await workbook.xlsx.write(res);
  res.end();
});

// Outras rotas para OFX, CNAB, PDF podem ser adicionadas de forma similar

export default router;
