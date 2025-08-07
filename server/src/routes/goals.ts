import { Router } from 'express';

const router = Router();

// Goals routes
router.get('/', (req, res) => {
  res.json({ message: 'Get goals endpoint - implementar' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create goal endpoint - implementar' });
});

export default router;
