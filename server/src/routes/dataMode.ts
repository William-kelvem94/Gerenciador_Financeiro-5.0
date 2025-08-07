import { Router } from 'express';

const router = Router();

// Data Mode routes
router.get('/current', (req, res) => {
  res.json({ message: 'Get current data mode endpoint - implementar' });
});

router.post('/switch', (req, res) => {
  res.json({ message: 'Switch data mode endpoint - implementar' });
});

export default router;
