import { Router } from 'express';

const router = Router();

// Users routes
router.get('/', (req, res) => {
  res.json({ message: 'Get users endpoint - implementar' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get user ${req.params.id} endpoint - implementar` });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update user ${req.params.id} endpoint - implementar` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete user ${req.params.id} endpoint - implementar` });
});

export default router;
