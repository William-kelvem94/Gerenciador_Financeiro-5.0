/**
 * 👤 Serviço de Usuário - Will Finance 5.0
 * 
 * Gerencia operações relacionadas aos usuários
 */

import { PrismaClient, User } from '@prisma/client';
import { UserResponseDto } from '../dtos';
import { AppError } from '../../../shared/errors/AppError';
import { HTTP_STATUS } from '../../../shared/constants/httpStatus';
import { logger } from '../../../utils/logger';

const prisma = new PrismaClient();

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  emailVerificationToken?: string;
  avatar?: string;
  googleId?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  theme?: string;
  language?: string;
  currency?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}

export class UserService {
  /**
   * 🔍 Buscar usuário por ID
   */
  async findById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });

      return user;
    } catch (error) {
      logger.error('Erro ao buscar usuário por ID:', error);
      throw new AppError('Erro interno do servidor', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🔍 Buscar usuário por ID com senha
   */
  async findByIdWithPassword(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });

      return user;
    } catch (error) {
      logger.error('Erro ao buscar usuário por ID com senha:', error);
      throw new AppError('Erro interno do servidor', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🔍 Buscar usuário por email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      return user;
    } catch (error) {
      logger.error('Erro ao buscar usuário por email:', error);
      throw new AppError('Erro interno do servidor', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🔍 Buscar usuário por email com senha
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      return user;
    } catch (error) {
      logger.error('Erro ao buscar usuário por email com senha:', error);
      throw new AppError('Erro interno do servidor', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🔍 Buscar usuário por Google ID
   */
  async findByGoogleId(googleId: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { googleId }
      });

      return user;
    } catch (error) {
      logger.error('Erro ao buscar usuário por Google ID:', error);
      throw new AppError('Erro interno do servidor', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🔍 Buscar usuário por token de verificação de email
   */
  async findByEmailVerificationToken(token: string): Promise<User | null> {
    try {
      const user = await prisma.user.findFirst({
        where: { 
          emailVerificationToken: token,
          emailVerified: false
        }
      });

      return user;
    } catch (error) {
      logger.error('Erro ao buscar usuário por token de verificação:', error);
      throw new AppError('Erro interno do servidor', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🔍 Buscar usuário por token de reset de senha
   */
  async findByPasswordResetToken(token: string): Promise<User | null> {
    try {
      const user = await prisma.user.findFirst({
        where: { 
          passwordResetToken: token,
          passwordResetExpires: {
            gt: new Date()
          }
        }
      });

      return user;
    } catch (error) {
      logger.error('Erro ao buscar usuário por token de reset:', error);
      throw new AppError('Erro interno do servidor', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * ➕ Criar novo usuário
   */
  async create(userData: CreateUserData): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          emailVerificationToken: userData.emailVerificationToken,
          avatar: userData.avatar,
          googleId: userData.googleId
        }
      });

      return user;
    } catch (error) {
      logger.error('Erro ao criar usuário:', error);
      throw new AppError('Erro ao criar usuário', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * ✏️ Atualizar perfil do usuário
   */
  async updateProfile(id: string, updateData: UpdateProfileData): Promise<User> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          name: updateData.name,
          email: updateData.email,
          phone: updateData.phone,
          avatar: updateData.avatar,
          theme: updateData.theme,
          language: updateData.language,
          currency: updateData.currency,
          emailNotifications: updateData.emailNotifications,
          pushNotifications: updateData.pushNotifications
        }
      });

      return user;
    } catch (error) {
      logger.error('Erro ao atualizar perfil:', error);
      throw new AppError('Erro ao atualizar perfil', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🔐 Atualizar senha
   */
  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id },
        data: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      logger.error('Erro ao atualizar senha:', error);
      throw new AppError('Erro ao atualizar senha', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🔑 Definir token de reset de senha
   */
  async setPasswordResetToken(id: string, token: string, expires: Date): Promise<void> {
    try {
      await prisma.user.update({
        where: { id },
        data: { 
          passwordResetToken: token,
          passwordResetExpires: expires,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      logger.error('Erro ao definir token de reset:', error);
      throw new AppError('Erro interno do servidor', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🔑 Redefinir senha
   */
  async resetPassword(id: string, hashedPassword: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id },
        data: { 
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      logger.error('Erro ao redefinir senha:', error);
      throw new AppError('Erro ao redefinir senha', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * ✅ Verificar email
   */
  async verifyEmail(id: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id },
        data: { 
          emailVerified: true,
          emailVerificationToken: null,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      logger.error('Erro ao verificar email:', error);
      throw new AppError('Erro ao verificar email', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🔄 Atualizar token de verificação de email
   */
  async updateEmailVerificationToken(id: string, token: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id },
        data: { 
          emailVerificationToken: token,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      logger.error('Erro ao atualizar token de verificação:', error);
      throw new AppError('Erro interno do servidor', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🕐 Atualizar último login
   */
  async updateLastLogin(id: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id },
        data: { 
          lastLoginAt: new Date(),
          updatedAt: new Date()
        }
      });
    } catch (error) {
      logger.error('Erro ao atualizar último login:', error);
      // Não lança erro para não bloquear o login
    }
  }

  /**
   * 🧹 Sanitizar dados do usuário (remover informações sensíveis)
   */
  sanitizeUser(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role as 'USER' | 'ADMIN',
      preferences: {
        theme: user.theme as 'light' | 'dark' | 'auto',
        language: user.language as 'pt-BR' | 'en-US',
        currency: user.currency as 'BRL' | 'USD' | 'EUR',
        notifications: {
          email: user.emailNotifications,
          push: user.pushNotifications,
          budget: user.budgetAlerts,
          transactions: true
        }
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  /**
   * 🗑️ Desativar usuário (soft delete)
   */
  async deactivate(id: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id },
        data: { 
          isActive: false,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      logger.error('Erro ao desativar usuário:', error);
      throw new AppError('Erro ao desativar usuário', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * ♻️ Reativar usuário
   */
  async reactivate(id: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id },
        data: { 
          isActive: true,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      logger.error('Erro ao reativar usuário:', error);
      throw new AppError('Erro ao reativar usuário', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}
