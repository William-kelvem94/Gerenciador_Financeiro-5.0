import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => res.json({ message: 'Google Auth route' }));
export default router;
