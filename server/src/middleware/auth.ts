import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'will-finance-6.0-super-secret-cyberpunk-jwt-key-2024';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token de acesso requerido' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: { userId?: string } | undefined) => {
    if (err || !decoded?.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Token inválido' 
      });
    }
    // Função auxiliar para buscar usuário
    (async () => {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true }
      });
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Usuário não encontrado' 
        });
      }
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name
      };
      next();
    })();
  });
}
