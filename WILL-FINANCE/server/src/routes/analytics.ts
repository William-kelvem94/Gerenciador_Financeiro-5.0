import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();
router.use(authenticateToken);

router.get('/dashboard', asyncHandler(async (req: any, res: any) => {
  res.json({ status: 'success', data: { analytics: {} } });
}));

export default router;
