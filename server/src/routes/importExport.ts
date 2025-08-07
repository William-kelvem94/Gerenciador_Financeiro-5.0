import { Router } from 'express';

const router = Router();

// Import/Export routes
router.post('/import', (req, res) => {
  res.json({ message: 'Import endpoint - implementar' });
});

router.post('/preview', (req, res) => {
  res.json({ message: 'Preview import endpoint - implementar' });
});

router.get('/export', (req, res) => {
  res.json({ message: 'Export endpoint - implementar' });
});

router.get('/stats', (req, res) => {
  res.json({ message: 'Import/Export stats endpoint - implementar' });
});

export default router;
