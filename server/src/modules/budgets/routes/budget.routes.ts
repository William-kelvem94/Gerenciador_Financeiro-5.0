import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { BudgetService } from '../services/budget.service';
import { BudgetController } from '../controllers/budget.controller';

const prisma = new PrismaClient();
const service = new BudgetService(prisma);
const controller = new BudgetController(service);

const router = Router();

router.post('/', (req, res) => controller.create(req, res));
router.put('/', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.get('/', (req, res) => controller.findAll(req, res));

export default router;
