import { Router } from 'express';

const router = Router();

// Notifications routes
router.get('/', (req, res) => {
  res.json({ message: 'Get notifications endpoint - implementar' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create notification endpoint - implementar' });
});

export default router;
