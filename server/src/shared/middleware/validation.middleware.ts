/**
 * 🛡️ Validation Middleware - Will Finance 5.0
 * 
 * Middleware para validação de dados usando Zod
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware de validação usando schemas Zod
 */
export const validationMiddleware = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validar o corpo da requisição
      const validatedData = schema.parse(req.body);
      
      // Substituir req.body pelos dados validados
      req.body = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formatar erros de validação do Zod
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        res.status(400).json({
          error: 'Dados de entrada inválidos',
          details: errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Erro interno do servidor
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Erro durante a validação dos dados',
        timestamp: new Date().toISOString(),
      });
    }
  };
};

/**
 * Middleware de validação para parâmetros da URL
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedParams = schema.parse(req.params);
      req.params = validatedParams;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        res.status(400).json({
          error: 'Parâmetros inválidos',
          details: errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Erro durante a validação dos parâmetros',
        timestamp: new Date().toISOString(),
      });
    }
  };
};

/**
 * Middleware de validação para query parameters
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedQuery = schema.parse(req.query);
      req.query = validatedQuery;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        res.status(400).json({
          error: 'Parâmetros de consulta inválidos',
          details: errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Erro durante a validação dos parâmetros de consulta',
        timestamp: new Date().toISOString(),
      });
    }
  };
};
