
/**
 * Controller enterprise de relatórios financeiros
 * - CRUD, geração, exportação, IA
 * - Logging, auditoria, resposta padronizada
 * @author Will Finance Team
 */
import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';
import { ResponseHelper } from '../../../shared/utils/response.util';
import { logger } from '../../../shared/utils/logger.util';

// Augment Express Request type to incluir 'user'
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export class ReportController {
  constructor(private readonly service: ReportService) {}

  /**
   * Cria um novo relatório financeiro
   * @route POST /api/reports
   */
  async create(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Criando relatório', { userId: req.user.id, body: req.body });
      const report = await this.service.create({ ...req.body, userId: req.user.id });
      res.status(201).json(ResponseHelper.success(report, 'Relatório criado com sucesso'));
    } catch (error) {
      logger.error('Erro ao criar relatório', { error: error.message, stack: error.stack });
      res.status(400).json(ResponseHelper.error('REPORT_CREATE_ERROR', error.message));
    }
  }

  /**
   * Atualiza relatório existente
   * @route PUT /api/reports/:id
   */
  async update(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Atualizando relatório', { userId: req.user.id, body: req.body });
  const report = await this.service.update(req.params.id, { ...req.body, userId: req.user.id });
      res.json(ResponseHelper.success(report, 'Relatório atualizado com sucesso'));
    } catch (error) {
      logger.error('Erro ao atualizar relatório', { error: error.message, stack: error.stack });
      res.status(400).json(ResponseHelper.error('REPORT_UPDATE_ERROR', error.message));
    }
  }

  /**
   * Remove relatório por ID
   * @route DELETE /api/reports/:id
   */
  async delete(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Removendo relatório', { userId: req.user.id, id: req.params.id });
      await this.service.delete(req.params.id);
      res.json(ResponseHelper.success(true, 'Relatório removido com sucesso'));
    } catch (error) {
      logger.error('Erro ao remover relatório', { error: error.message, stack: error.stack });
      res.status(400).json(ResponseHelper.error('REPORT_DELETE_ERROR', error.message));
    }
  }

  /**
   * Busca relatório por ID
   * @route GET /api/reports/:id
   */
  async findById(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Buscando relatório por ID', { userId: req.user.id, id: req.params.id });
      const report = await this.service.findById(req.params.id);
      if (!report) return res.status(404).json(ResponseHelper.error('REPORT_NOT_FOUND', 'Relatório não encontrado'));
      res.json(ResponseHelper.success(report, 'Relatório encontrado'));
    } catch (error) {
      logger.error('Erro ao buscar relatório', { error: error.message, stack: error.stack });
      res.status(404).json(ResponseHelper.error('REPORT_NOT_FOUND', error.message));
    }
  }

  /**
   * Lista todos os relatórios do usuário
   * @route GET /api/reports
   */
  async findAll(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Listando relatórios', { userId: req.user.id, query: req.query });
  const reports = await this.service.findAll(req.user.id);
      res.json(ResponseHelper.success(reports, 'Relatórios listados com sucesso'));
    } catch (error) {
      logger.error('Erro ao listar relatórios', { error: error.message, stack: error.stack });
      res.status(400).json(ResponseHelper.error('REPORT_LIST_ERROR', error.message));
    }
  }

  /**
   * Gera relatório customizado (ex: PDF, Excel)
   * @route POST /api/reports/generate
   */
  async generate(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Gerando relatório customizado', { userId: req.user.id, body: req.body });
      const file = await this.service.generateReport({ ...req.body, userId: req.user.id });
      res.json(ResponseHelper.success(file, 'Relatório gerado com sucesso'));
    } catch (error) {
      logger.error('Erro ao gerar relatório', { error: error.message, stack: error.stack });
      res.status(400).json(ResponseHelper.error('REPORT_GENERATE_ERROR', error.message));
    }
  }

  /**
   * Exporta relatório (ex: CSV, PDF)
   * @route GET /api/reports/:id/export
   */
  async export(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Exportando relatório', { userId: req.user.id, id: req.params.id });
      const file = await this.service.exportReport(req.params.id);
      res.json(ResponseHelper.success(file, 'Relatório exportado com sucesso'));
    } catch (error) {
      logger.error('Erro ao exportar relatório', { error: error.message, stack: error.stack });
      res.status(400).json(ResponseHelper.error('REPORT_EXPORT_ERROR', error.message));
    }
  }

  /**
   * Gera insights automáticos via IA
   * @route POST /api/reports/insights
   */
  async aiInsights(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Gerando insights IA', { userId: req.user.id, body: req.body });
      const insights = await this.service.generateAIInsights({ ...req.body, userId: req.user.id });
      res.json(ResponseHelper.success(insights, 'Insights gerados com sucesso'));
    } catch (error) {
      logger.error('Erro ao gerar insights IA', { error: error.message, stack: error.stack });
      res.status(400).json(ResponseHelper.error('REPORT_AI_ERROR', error.message));
    }
  }
}
