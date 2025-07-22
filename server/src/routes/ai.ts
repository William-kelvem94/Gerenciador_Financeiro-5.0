import { Router } from 'express';

const router = Router();

// AI routes
router.post('/chat', (req, res) => {
  res.json({ message: 'AI chat endpoint - implementar' });
});

router.post('/analyze', (req, res) => {
  res.json({ message: 'AI analyze endpoint - implementar' });
});

export default router;
