import { Router } from 'express';

const router = Router();

// Analytics routes
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Dashboard analytics endpoint - implementar' });
});

router.get('/reports', (req, res) => {
  res.json({ message: 'Reports analytics endpoint - implementar' });
});

export default router;
