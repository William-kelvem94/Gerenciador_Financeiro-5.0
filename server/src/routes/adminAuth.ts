import { Router } from 'express';

const router = Router();

// Admin authentication routes
router.post('/login', (req, res) => {
  res.json({ message: 'Admin login endpoint - implementar' });
});

router.post('/register', (req, res) => {
  res.json({ message: 'Admin register endpoint - implementar' });
});

export default router;
