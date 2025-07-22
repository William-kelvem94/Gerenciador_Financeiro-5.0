import { Router } from 'express';

const router = Router();

// Accounts routes
router.get('/', (req, res) => {
  res.json({ message: 'Get accounts endpoint - implementar' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create account endpoint - implementar' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get account ${req.params.id} endpoint - implementar` });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update account ${req.params.id} endpoint - implementar` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete account ${req.params.id} endpoint - implementar` });
});

export default router;
