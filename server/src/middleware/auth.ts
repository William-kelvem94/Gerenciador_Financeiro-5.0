import { Response, NextFunction } from 'express';
import { createError } from './errorHandler';
import { logger } from '@/utils/logger';
import { extractAndValidateJWT, AuthenticatedRequest } from '../auth/strategies/jwt.strategy';

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw createError('Access token required', 401);
    }

    const user = await extractAndValidateJWT(authHeader);
    
    if (!user) {
      throw createError('Invalid or expired token', 401);
    }

    // Add user info to request
    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      throw createError('Invalid token', 401);
    } else if (error.name === 'TokenExpiredError') {
      throw createError('Token expired', 401);
    } else {
      throw error;
    }
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const user = await extractAndValidateJWT(authHeader);
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // If token is invalid, continue without authentication
    logger.debug('Optional auth error:', error);
    next();
  }
};
