/**
 * Controller de orçamentos financeiros
 * Rotas: CRUD, filtros, alertas, IA
 */
import { Request, Response } from 'express';
import { BudgetService } from '../services/budget.service';
import { ResponseHelper } from '../../../shared/utils/response.util';
import { logger } from '../../../shared/utils/logger.util';

// Augment Express Request type to include 'user'
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

/**
 * Controller enterprise de orçamentos financeiros
 * - CRUD, filtros, alertas, IA
 * - Logging, auditoria, resposta padronizada
 * @author Will Finance Team
 */
export class BudgetController {
  constructor(private readonly service: BudgetService) {}

  /**
   * Cria um novo orçamento financeiro
   * @route POST /api/budgets
   */
  async create(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Criando orçamento', { userId: req.user.id, body: req.body });
      const budget = await this.service.create({ ...req.body, userId: req.user.id });
      res.status(201).json(ResponseHelper.success(budget, 'Orçamento criado com sucesso'));
    } catch (error) {
      logger.error('Erro ao criar orçamento', { error: error.message, stack: error.stack });
      res.status(400).json(ResponseHelper.error('BUDGET_CREATE_ERROR', error.message));
    }
  }

  /**
   * Atualiza orçamento existente
   * @route PUT /api/budgets/:id
   */
  async update(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Atualizando orçamento', { userId: req.user.id, body: req.body });
      const budget = await this.service.update({ ...req.body, userId: req.user.id });
      res.json(ResponseHelper.success(budget, 'Orçamento atualizado com sucesso'));
    } catch (error) {
      logger.error('Erro ao atualizar orçamento', { error: error.message, stack: error.stack });
      res.status(400).json(ResponseHelper.error('BUDGET_UPDATE_ERROR', error.message));
    }
  }

  /**
   * Remove orçamento por ID
   * @route DELETE /api/budgets/:id
   */
  async delete(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Removendo orçamento', { userId: req.user.id, id: req.params.id });
      await this.service.delete(req.params.id);
      res.json(ResponseHelper.success(true, 'Orçamento removido com sucesso'));
    } catch (error) {
      logger.error('Erro ao remover orçamento', { error: error.message, stack: error.stack });
      res.status(400).json(ResponseHelper.error('BUDGET_DELETE_ERROR', error.message));
    }
  }

  /**
   * Busca orçamento por ID
   * @route GET /api/budgets/:id
   */
  async findById(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Buscando orçamento por ID', { userId: req.user.id, id: req.params.id });
      const budget = await this.service.findById(req.params.id);
      res.json(ResponseHelper.success(budget, 'Orçamento encontrado'));
    } catch (error) {
      logger.error('Erro ao buscar orçamento', { error: error.message, stack: error.stack });
      res.status(404).json(ResponseHelper.error('BUDGET_NOT_FOUND', error.message));
    }
  }

  /**
   * Lista todos os orçamentos do usuário
   * @route GET /api/budgets
   */
  async findAll(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Listando orçamentos', { userId: req.user.id, query: req.query });
      const budgets = await this.service.findAll({ userId: req.user.id, ...req.query });
      res.json(ResponseHelper.success(budgets, 'Orçamentos listados com sucesso'));
    } catch (error) {
      logger.error('Erro ao listar orçamentos', { error: error.message, stack: error.stack });
      res.status(400).json(ResponseHelper.error('BUDGET_LIST_ERROR', error.message));
    }
  }
}
