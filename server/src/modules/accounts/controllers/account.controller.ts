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
import { ResponseHelper } from '../../../shared/utils/response.util';
import { logger } from '../../../shared/utils/logger.util';

/**
 * Controller enterprise de contas bancárias
 * - CRUD, filtros, multi-moeda, auditoria
 * - Logging, resposta padronizada
 * @author Will Finance Team
 */
export class AccountController {
  constructor(private readonly service: AccountService) {}

  /**
   * Cria uma nova conta bancária
   * @route POST /api/accounts
   */
  async create(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Criando conta', { userId: req.user.id, body: req.body });
      const account = await this.service.create({ ...req.body, userId: req.user.id });
      res.status(201).json(ResponseHelper.success(account, 'Conta criada com sucesso'));
    } catch (error) {
      logger.error('Erro ao criar conta', { error: error.message, stack: error.stack });
      res.status(400).json(ResponseHelper.error('ACCOUNT_CREATE_ERROR', error.message));
    }
  }

  /**
   * Lista todas as contas do usuário
   * @route GET /api/accounts
   */
  async findAll(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Listando contas', { userId: req.user.id, query: req.query });
      const accounts = await this.service.findAll(req.user.id);
      res.json(ResponseHelper.success(accounts, 'Contas listadas com sucesso'));
    } catch (error) {
      logger.error('Erro ao listar contas', { error: error.message, stack: error.stack });
      res.status(400).json(ResponseHelper.error('ACCOUNT_LIST_ERROR', error.message));
    }
  }

  /**
   * Busca conta por ID
   * @route GET /api/accounts/:id
   */
  async findById(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Buscando conta por ID', { userId: req.user.id, id: req.params.id });
      const account = await this.service.findById(req.params.id);
      if (!account) return res.status(404).json(ResponseHelper.error('ACCOUNT_NOT_FOUND', 'Conta não encontrada'));
      res.json(ResponseHelper.success(account, 'Conta encontrada'));
    } catch (error) {
      logger.error('Erro ao buscar conta', { error: error.message, stack: error.stack });
      res.status(404).json(ResponseHelper.error('ACCOUNT_NOT_FOUND', error.message));
    }
  }

  /**
   * Atualiza conta existente
   * @route PUT /api/accounts/:id
   */
  async update(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Atualizando conta', { userId: req.user.id, body: req.body });
      const account = await this.service.update(req.params.id, { ...req.body, userId: req.user.id });
      res.json(ResponseHelper.success(account, 'Conta atualizada com sucesso'));
    } catch (error) {
      logger.error('Erro ao atualizar conta', { error: error.message, stack: error.stack });
      res.status(400).json(ResponseHelper.error('ACCOUNT_UPDATE_ERROR', error.message));
    }
  }

  /**
   * Remove conta por ID
   * @route DELETE /api/accounts/:id
   */
  async delete(req: Request, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json(ResponseHelper.error('UNAUTHORIZED', 'Usuário não autenticado'));
      logger.info('Removendo conta', { userId: req.user.id, id: req.params.id });
      await this.service.delete(req.params.id);
      res.json(ResponseHelper.success(true, 'Conta removida com sucesso'));
    } catch (error) {
      logger.error('Erro ao remover conta', { error: error.message, stack: error.stack });
      res.status(400).json(ResponseHelper.error('ACCOUNT_DELETE_ERROR', error.message));
    }
  }
}
