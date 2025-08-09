
/**
 * Controller Enterprise de Transações Financeiras
 * - CRUD, filtros, exportação, upload, auditoria, IA, segurança
 * @author Will Finance Team
 */
import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { TransactionSchema } from '../dto/transaction.dto';
import { ResponseHelper } from '../../../shared/utils/response.util';
import { logger } from '../../../shared/utils/logger.util';

export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  /**
   * Cria nova transação (com validação e auditoria)
   */
  async create(req: Request, res: Response) {
    try {
      const userId = typeof req.user?.id === 'string' ? req.user.id : '';
      const validation = TransactionSchema.omit({ id: true }).safeParse({ ...req.body, userId });
      if (!validation.success) {
        logger.warn('Falha validação transação', { issues: validation.error.issues });
        return res.status(400).json(ResponseHelper.error('VALIDATION_ERROR', 'Dados inválidos', validation.error.issues.map(e => e.message)));
      }
      const transaction = await this.service.create(validation.data);
      await this.service.auditLog('CREATE', { userId, transactionId: transaction.id });
      res.status(201).json(ResponseHelper.success(transaction, 'Transação criada com sucesso'));
    } catch (error: any) {
      logger.error('Erro ao criar transação', { error: error.message });
      res.status(500).json(ResponseHelper.error('INTERNAL_ERROR', error.message));
    }
  }

  /**
   * Atualiza transação existente
   */
  async update(req: Request, res: Response) {
    try {
      const userId = typeof req.user?.id === 'string' ? req.user.id : '';
      const validation = TransactionSchema.partial().required({ id: true }).safeParse({ ...req.body, userId });
      if (!validation.success) {
        logger.warn('Falha validação update', { issues: validation.error.issues });
        return res.status(400).json(ResponseHelper.error('VALIDATION_ERROR', 'Dados inválidos', validation.error.issues.map(e => e.message)));
      }
      const transaction = await this.service.update(req.body.id, validation.data);
      await this.service.auditLog('UPDATE', { userId, transactionId: req.body.id });
      res.json(ResponseHelper.success(transaction, 'Transação atualizada com sucesso'));
    } catch (error: any) {
      logger.error('Erro ao atualizar transação', { error: error.message });
      res.status(500).json(ResponseHelper.error('INTERNAL_ERROR', error.message));
    }
  }

  /**
   * Remove transação
   */
  async delete(req: Request, res: Response) {
    try {
      await this.service.delete(req.params.id);
      await this.service.auditLog('DELETE', { userId: req.user?.id, transactionId: req.params.id });
      res.json(ResponseHelper.success(null, 'Transação removida com sucesso'));
    } catch (error: any) {
      logger.error('Erro ao remover transação', { error: error.message });
      res.status(500).json(ResponseHelper.error('INTERNAL_ERROR', error.message));
    }
  }

  /**
   * Busca transação por ID
   */
  async findById(req: Request, res: Response) {
    try {
      const transaction = await this.service.findById(req.params.id);
      if (!transaction) {
        return res.status(404).json(ResponseHelper.error('NOT_FOUND', 'Transação não encontrada'));
      }
      res.json(ResponseHelper.success(transaction));
    } catch (error: any) {
      logger.error('Erro ao buscar transação', { error: error.message });
      res.status(500).json(ResponseHelper.error('INTERNAL_ERROR', error.message));
    }
  }

  /**
   * Lista transações do usuário (filtros avançados)
   */
  async findAll(req: Request, res: Response) {
    try {
      const userId = typeof req.user?.id === 'string' ? req.user.id : '';
      // Validação básica para filtros, pode ser expandida
      const validation = TransactionSchema.partial().safeParse({ ...req.query, userId });
      if (!validation.success) {
        logger.warn('Falha validação filtros', { issues: validation.error.issues });
        return res.status(400).json(ResponseHelper.error('VALIDATION_ERROR', 'Filtros inválidos', validation.error.issues.map(e => e.message)));
      }
      const transactions = await this.service.findAll({ ...validation.data, userId });
      res.json(ResponseHelper.success(transactions));
    } catch (error: any) {
      logger.error('Erro ao listar transações', { error: error.message });
      res.status(500).json(ResponseHelper.error('INTERNAL_ERROR', error.message));
    }
  }

  /**
   * Upload de comprovante (Multer)
   */
  async uploadReceipt(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      const file = req.file as Express.Multer.File;
      if (!file) {
        return res.status(400).json(ResponseHelper.error('NO_FILE', 'Nenhum arquivo enviado'));
      }
      const result = await this.service.uploadReceipt(transactionId, file);
      await this.service.auditLog('UPLOAD_RECEIPT', { userId: req.user?.id, transactionId, fileName: file.originalname });
      res.json(ResponseHelper.success(result, 'Comprovante enviado com sucesso'));
    } catch (error: any) {
      logger.error('Erro ao enviar comprovante', { error: error.message });
      res.status(500).json(ResponseHelper.error('INTERNAL_ERROR', error.message));
    }
  }

  /**
   * Exporta transações (CSV/PDF)
   */
  async export(req: Request, res: Response) {
    try {
      const { format = 'csv' } = req.query;
      const filters = { ...req.query, userId: req.user?.id };
  const userId = typeof req.user?.id === 'string' ? req.user.id : '';
  const result = await this.service.export(userId, format as 'csv' | 'pdf', filters);
      await this.service.auditLog('EXPORT', { userId: req.user?.id, format });
      res.json(ResponseHelper.success(result, 'Exportação realizada com sucesso'));
    } catch (error: any) {
      logger.error('Erro ao exportar transações', { error: error.message });
      res.status(500).json(ResponseHelper.error('INTERNAL_ERROR', error.message));
    }
  }
}
