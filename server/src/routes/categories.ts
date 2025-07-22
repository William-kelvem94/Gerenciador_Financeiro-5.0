import { Router } from 'express';

const router = Router();

// Categories routes
router.get('/', (req, res) => {
  res.json({ message: 'Get categories endpoint - implementar' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create category endpoint - implementar' });
});

export default router;
