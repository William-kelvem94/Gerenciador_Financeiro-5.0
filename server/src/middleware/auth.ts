import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@/config/database';
import { createError } from './errorHandler';
import { logger } from '@/utils/logger';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    username: string;
    email: string;
    firebaseUid?: string | undefined;
  };
  firebaseUser?: {
    uid: string;
    email?: string;
    name?: string;
    picture?: string;
    emailVerified?: boolean;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw createError('Access token required', 401);
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { 
        id: true, 
        username: true, 
        email: true,
        firebaseUid: true 
      },
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    // Add user info to request
    req.user = {
      userId: user.id,
      username: user.username,
      email: user.email,
      firebaseUid: user.firebaseUid || undefined,
    };

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
    const token = authHeader?.split(' ')[1];

    if (token) {
      // Try JWT
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { 
            id: true, 
            username: true, 
            email: true,
            firebaseUid: true 
          },
        });

        if (user) {
          req.user = {
            userId: user.id,
            username: user.username,
            email: user.email,
            firebaseUid: user.firebaseUid || undefined,
          };
        }
      } catch (jwtError) {
        logger.debug('Optional auth JWT failed', jwtError);
      }
    }

    next();
  } catch (error) {
    // If token is invalid, continue without authentication
    logger.debug('Optional auth error:', error);
    next();
  }
};
