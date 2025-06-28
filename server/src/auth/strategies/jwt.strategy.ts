import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';

export interface JwtPayload {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  firebaseUid: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Extrai e valida o token JWT do header Authorization
 */
export const extractAndValidateJWT = async (authHeader?: string): Promise<AuthenticatedUser | null> => {
  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(' ')[1]; // Bearer TOKEN
  if (!token) {
    return null;
  }

  try {
    // Verificar token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    if (!decoded.userId) {
      throw new Error('Token inválido: ID do usuário não encontrado');
    }

    // Buscar usuário no banco para verificar se ainda existe
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        firebaseUid: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return {
      userId: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      firebaseUid: user.firebaseUid,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    // Log do erro para debugging
    console.error('JWT validation error:', error);
    return null;
  }
};

/**
 * Gera tokens de acesso e refresh
 */
export const generateTokens = (userId: string, username: string) => {
  const accessToken = jwt.sign(
    { userId, username },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, username },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};
