import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();
router.use(authenticateToken);

// Placeholder routes for transactions
router.get('/', asyncHandler(async (req: any, res: any) => {
  res.json({ status: 'success', data: { transactions: [] } });
}));

router.post('/', asyncHandler(async (req: any, res: any) => {
  res.json({ status: 'success', message: 'Transaction created' });
}));

export default router;
