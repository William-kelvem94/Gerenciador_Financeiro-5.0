import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';

const router = Router();

// Rota para geração de insights automáticos
router.post('/insights', AIController.generateInsights);

export default router;
