import { Router } from 'express';
const router = Router();
// Adicione suas rotas aqui
router.get('/', (req, res) => res.json({ message: 'Auth route' }));
export default router;
