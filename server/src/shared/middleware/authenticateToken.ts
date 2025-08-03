/**
 * 🔐 Middleware de Autenticação - Will Finance 5.0
 */

import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../../modules/auth/services/TokenService';
import { UserService } from '../../modules/auth/services/UserService';
import { AppError } from '../errors/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { logger } from '../../utils/logger';

// Estender o tipo Request para incluir usuário
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

const tokenService = new TokenService();
const userService = new UserService();

/**
 * 🔐 Middleware para autenticar token JWT
 */
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = tokenService.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new AppError('Token de acesso requerido', HTTP_STATUS.UNAUTHORIZED);
    }

    // Verificar e decodificar o token
    const decoded = await tokenService.verifyAccessToken(token);

    // Buscar usuário no banco
    const user = await userService.findById(decoded.sub);
    if (!user || !user.isActive) {
      throw new AppError('Usuário não encontrado ou inativo', HTTP_STATUS.UNAUTHORIZED);
    }

    // Adicionar usuário à requisição
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    logger.error('Erro na autenticação:', error);
    
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Token inválido'
      });
    }
  }
}

/**
 * 🛡️ Middleware para verificar roles/permissões
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError('Usuário não autenticado', HTTP_STATUS.UNAUTHORIZED);
      }

      if (!roles.includes(req.user.role)) {
        throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN);
      }

      next();
    } catch (error) {
      logger.error('Erro na verificação de role:', error);
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: 'Acesso negado'
        });
      }
    }
  };
}

/**
 * 👤 Middleware opcional - não bloqueia se não houver token
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = tokenService.extractTokenFromHeader(authHeader);

    if (token) {
      try {
        const decoded = await tokenService.verifyAccessToken(token);
        const user = await userService.findById(decoded.sub);
        
        if (user && user.isActive) {
          req.user = {
            id: user.id,
            email: user.email,
            role: user.role
          };
        }
      } catch (error) {
        // Token inválido, mas não bloqueia a requisição
        logger.warn('Token inválido em auth opcional:', error);
      }
    }

    next();
  } catch (error) {
    logger.error('Erro no auth opcional:', error);
    next(); // Continua mesmo com erro
  }
}
