import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const service = new ReportService(prisma);

interface AuthRequest extends Request {
  user?: { userId: string };
}

export class ReportController {
  async create(req: AuthRequest, res: Response) {
    try {
  const report = await service.create({ ...req.body, userId: req.user!.id });
      res.status(201).json({ success: true, data: report });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async findAll(req: AuthRequest, res: Response) {
  const reports = await service.findAll(req.user!.id);
    res.json({ success: true, data: reports });
  }

  async findById(req: AuthRequest, res: Response) {
    const report = await service.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, error: 'Relatório não encontrado' });
    res.json({ success: true, data: report });
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const report = await service.update(req.params.id, req.body);
      res.json({ success: true, data: report });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    await service.delete(req.params.id);
    res.json({ success: true });
  }
}
