import { Router } from 'express';

const router = Router();

// Google OAuth routes
router.get('/auth', (req, res) => {
  res.json({ message: 'Google OAuth auth endpoint - implementar' });
});

router.get('/callback', (req, res) => {
  res.json({ message: 'Google OAuth callback endpoint - implementar' });
});

export default router;
