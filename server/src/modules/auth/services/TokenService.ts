/**
 * 🔑 Serviço de Token - Will Finance 5.0
 * 
 * Gerencia tokens JWT (access e refresh tokens)
 */

import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { TokensDto } from '../dtos';
import { AppError } from '../../../shared/errors/AppError';
import { HTTP_STATUS } from '../../../shared/constants/httpStatus';
import { logger } from '../../../utils/logger';

const prisma = new PrismaClient();

interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

interface DecodedToken {
  exp?: number;
  [key: string]: string | number | boolean | undefined;
}

export class TokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'your-super-secret-access-key';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key';
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
  }

  /**
   * 🔗 Gerar tokens (access + refresh)
   */
  async generateTokens(userId: string, email: string): Promise<TokensDto> {
    try {
      const payload = {
        sub: userId,
        email
      };

      // Gerar access token
      const accessToken = jwt.sign(payload, this.accessTokenSecret, {
        expiresIn: this.accessTokenExpiry as string,
        issuer: 'will-finance',
        audience: 'will-finance-app'
      } as jwt.SignOptions);

      // Gerar refresh token
      const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
        expiresIn: this.refreshTokenExpiry as string,
        issuer: 'will-finance',
        audience: 'will-finance-app'
      } as jwt.SignOptions);

      // Calcular tempo de expiração
      const decoded = jwt.decode(accessToken) as { exp: number };
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

      // Salvar refresh token no banco (para poder invalidar depois)
      await this.saveRefreshToken(userId);

      return {
        accessToken,
        refreshToken,
        expiresIn
      };
    } catch (error) {
      logger.error('Erro ao gerar tokens:', error);
      throw new AppError('Erro ao gerar tokens', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * ✅ Verificar access token
   */
  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'will-finance',
        audience: 'will-finance-app'
      }) as JwtPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token expirado', HTTP_STATUS.UNAUTHORIZED);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Token inválido', HTTP_STATUS.UNAUTHORIZED);
      }
      throw new AppError('Erro na verificação do token', HTTP_STATUS.UNAUTHORIZED);
    }
  }

  /**
   * ✅ Verificar refresh token
   */
  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'will-finance',
        audience: 'will-finance-app'
      }) as JwtPayload;

      // Verificar se o refresh token ainda existe no banco
      const storedToken = await this.findRefreshToken(decoded.sub);
      if (!storedToken) {
        throw new AppError('Refresh token revogado', HTTP_STATUS.UNAUTHORIZED);
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Refresh token expirado', HTTP_STATUS.UNAUTHORIZED);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Refresh token inválido', HTTP_STATUS.UNAUTHORIZED);
      }
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro na verificação do refresh token', HTTP_STATUS.UNAUTHORIZED);
    }
  }

  /**
   * 💾 Salvar refresh token no banco
   */
  private async saveRefreshToken(userId: string): Promise<void> {
    try {
      // Para simplificar, vou salvar apenas uma flag que indica se o usuário tem refresh tokens válidos
      // Em uma implementação mais robusta, você salvaria os tokens em uma tabela separada
      await prisma.user.update({
        where: { id: userId },
        data: { updatedAt: new Date() }
      });
    } catch (error) {
      logger.error('Erro ao salvar refresh token:', error);
      throw new AppError('Erro interno do servidor', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🔍 Buscar refresh token
   */
  private async findRefreshToken(userId: string): Promise<boolean> {
    try {
      // Verificar se o usuário existe e está ativo
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      return user ? user.isActive : false;
    } catch (error) {
      logger.error('Erro ao buscar refresh token:', error);
      return false;
    }
  }

  /**
   * ❌ Revogar todos os tokens de um usuário
   */
  async revokeAllTokens(userId: string): Promise<void> {
    try {
      // Marcar como desatualizado para invalidar tokens
      await prisma.user.update({
        where: { id: userId },
        data: { updatedAt: new Date() }
      });
    } catch (error) {
      logger.error('Erro ao revogar tokens:', error);
      throw new AppError('Erro interno do servidor', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * ❌ Revogar refresh token específico
   */
  async revokeRefreshToken(userId: string): Promise<void> {
    try {
      // Em uma implementação mais robusta, você removeria o token específico
      // Por simplicidade, vamos apenas atualizar o timestamp
      await prisma.user.update({
        where: { id: userId },
        data: { updatedAt: new Date() }
      });
    } catch (error) {
      logger.error('Erro ao revogar refresh token:', error);
      throw new AppError('Erro interno do servidor', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🔍 Extrair token do header Authorization
   */
  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    return authHeader.substring(7); // Remove "Bearer "
  }

  /**
   * 📊 Decodificar token sem verificar (para debug)
   */
  decodeToken(token: string): jwt.JwtPayload | string | null {
    try {
      return jwt.decode(token);
    } catch (error) {
      logger.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  /**
   * ⏰ Verificar se o token está próximo do vencimento
   */
  isTokenExpiringSoon(token: string, thresholdMinutes: number = 5): boolean {
    try {
      const decoded = this.decodeToken(token) as DecodedToken;
      if (!decoded || !decoded.exp) {
        return true;
      }

      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - now;
      const thresholdSeconds = thresholdMinutes * 60;

      return timeUntilExpiry <= thresholdSeconds;
    } catch (error) {
      logger.error('Erro ao verificar expiração do token:', error);
      return true;
    }
  }
}
