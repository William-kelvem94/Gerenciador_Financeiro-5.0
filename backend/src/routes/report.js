import express from 'express';
import db from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import puppeteer from 'puppeteer';

const router = express.Router();

// Relatório: Saldo por conta
router.get('/balance-by-account', async (req, res) => {
  try {
    const accounts = await db.Account.findAll({
      attributes: [
        'id', 'name',
        [fn('COALESCE', fn('SUM', col('Transactions.value')), 0), 'balance']
      ],
      include: [{
        model: db.Transaction,
        attributes: [],
      }],
      group: ['Account.id']
    });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Relatório: Despesas por categoria em um período
router.get('/expenses-by-category', async (req, res) => {
  try {
    const { start, end } = req.query;
    const expenses = await db.Transaction.findAll({
      where: {
        type: 'saida',
        date: { [Op.between]: [start, end] }
      },
      attributes: [
        'categoryId',
        [fn('SUM', col('value')), 'total']
      ],
      group: ['categoryId'],
      include: [{ model: db.Category, attributes: ['name'] }]
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Relatório: Resumo mensal (entradas, saídas)
router.get('/monthly-summary', async (req, res) => {
  try {
    const { year, month } = req.query;
    const start = `${year}-${month}-01`;
    const end = `${year}-${month}-31`;
    const summary = await db.Transaction.findAll({
      where: { date: { [Op.between]: [start, end] } },
      attributes: [
        'type',
        [fn('SUM', col('value')), 'total']
      ],
      group: ['type']
    });
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exportar relatório em PDF
router.get('/balance-by-account/pdf', async (req, res) => {
  try {
    const accounts = await db.Account.findAll({
      attributes: ['id', 'name', [fn('COALESCE', fn('SUM', col('Transactions.value')), 0), 'balance']],
      include: [{ model: db.Transaction, attributes: [] }],
      group: ['Account.id']
    });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
    doc.pipe(res);
    doc.text('Relatório de Saldo por Conta');
    accounts.forEach(acc => {
      doc.text(`${acc.name}: R$ ${acc.dataValues.balance}`);
    });
    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exportar relatório em Excel
router.get('/balance-by-account/excel', async (req, res) => {
  try {
    const accounts = await db.Account.findAll({
      attributes: ['id', 'name', [fn('COALESCE', fn('SUM', col('Transactions.value')), 0), 'balance']],
      include: [{ model: db.Transaction, attributes: [] }],
      group: ['Account.id']
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Saldo por Conta');
    sheet.addRow(['Conta', 'Saldo']);
    accounts.forEach(acc => {
      sheet.addRow([acc.name, acc.dataValues.balance]);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exportar relatório como imagem (PNG/JPEG)
router.get('/balance-by-account/image', async (req, res) => {
  try {
    // Gera HTML simples do relatório
    const html = `<html><body><h1>Saldo por Conta</h1></body></html>`;
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(html);
    const buffer = await page.screenshot({ type: 'png' });
    await browser.close();
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Relatório customizável: transações filtradas
router.get('/transactions', async (req, res) => {
  const { start, end, type, categoryId, accountId, min, max, search, page = 1, limit = 20 } = req.query;
  const where = {};
  if (start && end) where.date = { [Op.between]: [start, end] };
  if (type) where.type = type;
  if (categoryId) where.categoryId = categoryId;
  if (accountId) where.accountId = accountId;
  if (min) where.value = { ...(where.value || {}), [Op.gte]: min };
  if (max) where.value = { ...(where.value || {}), [Op.lte]: max };
  if (search) where.description = { [Op.iLike]: `%${search}%` };

  const offset = (page - 1) * limit;
  const { rows, count } = await db.Transaction.findAndCountAll({
    where,
    include: [db.Category, db.Account],
    order: [['date', 'DESC']],
    offset,
    limit: parseInt(limit)
  });
  res.json({ total: count, page: parseInt(page), limit: parseInt(limit), data: rows });
});

// Exportar transações filtradas para Excel
router.get('/transactions/export/excel', async (req, res) => {
  // Use os mesmos filtros da rota acima
  const { start, end, type, categoryId, accountId, min, max, search } = req.query;
  const where = {};
  if (start && end) where.date = { [Op.between]: [start, end] };
  if (type) where.type = type;
  if (categoryId) where.categoryId = categoryId;
  if (accountId) where.accountId = accountId;
  if (min) where.value = { ...(where.value || {}), [Op.gte]: min };
  if (max) where.value = { ...(where.value || {}), [Op.lte]: max };
  if (search) where.description = { [Op.iLike]: `%${search}%` };

  const transactions = await db.Transaction.findAll({
    where,
    include: [db.Category, db.Account],
    order: [['date', 'DESC']]
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Transações');
  sheet.addRow(['Data', 'Descrição', 'Valor', 'Tipo', 'Categoria', 'Conta']);
  transactions.forEach(t => {
    sheet.addRow([
      t.date,
      t.description,
      t.value,
      t.type,
      t.Category ? t.Category.name : '',
      t.Account ? t.Account.name : ''
    ]);
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=transacoes.xlsx');
  await workbook.xlsx.write(res);
  res.end();
});

// Exportar transações filtradas para PDF
router.get('/transactions/export/pdf', async (req, res) => {
  // Use os mesmos filtros da rota acima
  const { start, end, type, categoryId, accountId, min, max, search } = req.query;
  const where = {};
  if (start && end) where.date = { [Op.between]: [start, end] };
  if (type) where.type = type;
  if (categoryId) where.categoryId = categoryId;
  if (accountId) where.accountId = accountId;
  if (min) where.value = { ...(where.value || {}), [Op.gte]: min };
  if (max) where.value = { ...(where.value || {}), [Op.lte]: max };
  if (search) where.description = { [Op.iLike]: `%${search}%` };

  const transactions = await db.Transaction.findAll({
    where,
    include: [db.Category, db.Account],
    order: [['date', 'DESC']]
  });

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=transacoes.pdf');
  doc.pipe(res);
  doc.fontSize(16).text('Relatório de Transações', { align: 'center' });
  doc.moveDown();
  transactions.forEach(t => {
    doc.fontSize(10).text(
      `${t.date} | ${t.description} | R$ ${t.value} | ${t.type} | ${t.Category ? t.Category.name : ''} | ${t.Account ? t.Account.name : ''}`
    );
  });
  doc.end();
});

// Exportar transações filtradas para imagem (PNG)
router.get('/transactions/export/image', async (req, res) => {
  // Use os mesmos filtros da rota acima
  const { start, end, type, categoryId, accountId, min, max, search } = req.query;
  const where = {};
  if (start && end) where.date = { [Op.between]: [start, end] };
  if (type) where.type = type;
  if (categoryId) where.categoryId = categoryId;
  if (accountId) where.accountId = accountId;
  if (min) where.value = { ...(where.value || {}), [Op.gte]: min };
  if (max) where.value = { ...(where.value || {}), [Op.lte]: max };
  if (search) where.description = { [Op.iLike]: `%${search}%` };

  const transactions = await db.Transaction.findAll({
    where,
    include: [db.Category, db.Account],
    order: [['date', 'DESC']]
  });

  let html = `<html><body><h1>Relatório de Transações</h1><table border="1"><tr><th>Data</th><th>Descrição</th><th>Valor</th><th>Tipo</th><th>Categoria</th><th>Conta</th></tr>`;
  transactions.forEach(t => {
    html += `<tr>
      <td>${t.date}</td>
      <td>${t.description}</td>
      <td>${t.value}</td>
      <td>${t.type}</td>
      <td>${t.Category ? t.Category.name : ''}</td>
      <td>${t.Account ? t.Account.name : ''}</td>
    </tr>`;
  });
  html += `</table></body></html>`;

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(html);
  const buffer = await page.screenshot({ type: 'png', fullPage: true });
  await browser.close();
  res.setHeader('Content-Type', 'image/png');
  res.send(buffer);
});

// Dashboard: evolução de saldo mensal
router.get('/dashboard/balance-evolution', async (req, res) => {
  const { year } = req.query;
  const results = await db.Transaction.findAll({
    attributes: [
      [fn('date_trunc', 'month', col('date')), 'month'],
      [fn('SUM', col('value')), 'total']
    ],
    group: [literal('month')],
    order: [ [literal('month'), 'ASC'] ],
    where: year ? {
      date: {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`]
      }
    } : undefined
  });
  res.json(results);
});

// Dashboard: distribuição por categoria
router.get('/dashboard/category-distribution', async (req, res) => {
  const { start, end } = req.query;
  const where = {};
  if (start && end) where.date = { [Op.between]: [start, end] };

  const results = await db.Transaction.findAll({
    attributes: [
      'categoryId',
      [fn('SUM', col('value')), 'total']
    ],
    where,
    include: [{ model: db.Category, attributes: ['name'] }],
    group: ['categoryId', 'Category.id']
  });
  res.json(results);
});

// Dashboard: fluxo de caixa (entradas e saídas por mês)
router.get('/dashboard/cashflow', async (req, res) => {
  const { year } = req.query;
  const results = await db.Transaction.findAll({
    attributes: [
      [fn('date_trunc', 'month', col('date')), 'month'],
      'type',
      [fn('SUM', col('value')), 'total']
    ],
    group: [literal('month'), 'type'],
    order: [ [literal('month'), 'ASC'] ],
    where: year ? {
      date: {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`]
      }
    } : undefined
  });
  res.json(results);
});

export default router;
