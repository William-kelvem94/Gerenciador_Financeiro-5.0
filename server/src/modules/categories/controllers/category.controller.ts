import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const service = new CategoryService(prisma);

interface AuthRequest extends Request {
  user?: { id: string };
}

export class CategoryController {
  async create(req: AuthRequest, res: Response) {
    try {
      const category = await service.create({ ...req.body, userId: req.user!.id });
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async findAll(req: AuthRequest, res: Response) {
    const categories = await service.findAll(req.user!.id);
    res.json({ success: true, data: categories });
  }

  async findById(req: AuthRequest, res: Response) {
    const category = await service.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, error: 'Categoria não encontrada' });
    res.json({ success: true, data: category });
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const category = await service.update(req.params.id, req.body);
      res.json({ success: true, data: category });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    await service.delete(req.params.id);
    res.json({ success: true });
  }
}
