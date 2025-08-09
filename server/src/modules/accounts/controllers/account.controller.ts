import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        // Add other user properties if needed
      };
    }
  }
}

import { AccountService } from '../services/account.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const service = new AccountService(prisma);

export class AccountController {
  async create(req: Request, res: Response) {
    try {
  const account = await service.create({ ...req.body, userId: req.user!.id });
      res.status(201).json({ success: true, data: account });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
  const accounts = await service.findAll(req.user!.id);
    res.json({ success: true, data: accounts });
  }

  async findById(req: Request, res: Response) {
    const account = await service.findById(req.params.id);
    if (!account) return res.status(404).json({ success: false, error: 'Conta não encontrada' });
    res.json({ success: true, data: account });
  }

  async update(req: Request, res: Response) {
    try {
      const account = await service.update(req.params.id, req.body);
      res.json({ success: true, data: account });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    await service.delete(req.params.id);
    res.json({ success: true });
  }
}
