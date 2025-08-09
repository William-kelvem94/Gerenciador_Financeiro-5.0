/**
 * Controller de transações financeiras
 * Rotas: CRUD, filtros, exportação, IA
 */
import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';

export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  async create(req: Request, res: Response) {
    try {
      const transaction = await this.service.create(req.body);
      res.status(201).json({ success: true, data: transaction });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const transaction = await this.service.update(req.body);
      res.json({ success: true, data: transaction });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.service.delete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const transaction = await this.service.findById(req.params.id);
      res.json({ success: true, data: transaction });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const transactions = await this.service.findAll({
        userId: req.user.id,
        ...req.query
      });
      res.json({ success: true, data: transactions });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
