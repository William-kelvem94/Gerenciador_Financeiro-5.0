import express from 'express';
import multer from 'multer';
import db from '../models/index.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { name, type, description, relatedAssetId } = req.body;
    const fileUrl = req.file ? req.file.path : null;
    const contract = await db.Contract.create({ name, type, description, fileUrl, relatedAssetId });
    res.status(201).json(contract);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const contracts = await db.Contract.findAll();
  res.json(contracts);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.Contract.destroy({ where: { id } });
  res.status(204).send();
});

export default router;
