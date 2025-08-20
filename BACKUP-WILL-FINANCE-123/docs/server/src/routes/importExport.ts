import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => res.json({ message: 'Import/Export route' }));
export default router;
