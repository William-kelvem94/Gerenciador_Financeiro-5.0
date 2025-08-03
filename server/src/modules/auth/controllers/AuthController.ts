/**
 * 🔐 Controller de Autenticação - Will Finance 5.0
 * 
 * Gerencia todas as operações relacionadas à autenticação de usuários
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { GoogleStrategy } from '../strategies/GoogleStrategy';
import { 
  RegisterDto, 
  LoginDto, 
  RefreshTokenDto, 
  UpdateProfileDto, 
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  ResendVerificationDto
} from '../dtos';
import { logger } from '../../../utils/logger';
import { AppError } from '../../../shared/errors/AppError';
import { HTTP_STATUS } from '../../../shared/constants/httpStatus';

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly googleStrategy: GoogleStrategy
  ) {}

  /**
   * 📝 Registrar novo usuário
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const registerDto: RegisterDto = req.body;
      
      logger.info(`Tentativa de registro para email: ${registerDto.email}`);

      const result = await this.authService.register(registerDto);

      logger.info(`Usuário registrado com sucesso: ${registerDto.email}`);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Usuário registrado com sucesso! Verifique seu email.',
        data: {
          user: result.user,
          tokens: result.tokens
        }
      });
    } catch (error) {
      logger.error('Erro no registro:', error);
      next(error);
    }
  }

  /**
   * 🔑 Login de usuário
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loginDto: LoginDto = req.body;
      
      logger.info(`Tentativa de login para email: ${loginDto.email}`);

      const result = await this.authService.login(loginDto);

      logger.info(`Login realizado com sucesso: ${loginDto.email}`);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Login realizado com sucesso!',
        data: {
          user: result.user,
          tokens: result.tokens
        }
      });
    } catch (error) {
      logger.error('Erro no login:', error);
      next(error);
    }
  }

  /**
   * 🔄 Renovar token de acesso
   */
  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshTokenDto: RefreshTokenDto = req.body;
      
      const result = await this.authService.refreshToken(refreshTokenDto.refreshToken);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Token renovado com sucesso!',
        data: {
          tokens: result
        }
      });
    } catch (error) {
      logger.error('Erro na renovação do token:', error);
      next(error);
    }
  }

  /**
   * 🚪 Logout de usuário
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        throw new AppError('Usuário não autenticado', HTTP_STATUS.UNAUTHORIZED);
      }

      await this.authService.logout(userId);

      logger.info(`Logout realizado para usuário: ${userId}`);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Logout realizado com sucesso!'
      });
    } catch (error) {
      logger.error('Erro no logout:', error);
      next(error);
    }
  }

  /**
   * 🔗 Autenticação Google - Iniciar
   */
  async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authUrl = await this.googleStrategy.getAuthUrl();

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'URL de autenticação Google gerada',
        data: {
          authUrl
        }
      });
    } catch (error) {
      logger.error('Erro na autenticação Google:', error);
      next(error);
    }
  }

  /**
   * 🔗 Callback do Google OAuth
   */
  async googleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code } = req.query;

      if (!code || typeof code !== 'string') {
        throw new AppError('Código de autorização inválido', HTTP_STATUS.BAD_REQUEST);
      }

      const result = await this.googleStrategy.handleCallback(code);

      logger.info(`Login Google realizado: ${result.user.email}`);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Login Google realizado com sucesso!',
        data: {
          user: result.user,
          tokens: result.tokens
        }
      });
    } catch (error) {
      logger.error('Erro no callback Google:', error);
      next(error);
    }
  }

  /**
   * 👤 Obter perfil do usuário
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('Usuário não autenticado', HTTP_STATUS.UNAUTHORIZED);
      }

      const user = await this.userService.findById(userId);

      if (!user) {
        throw new AppError('Usuário não encontrado', HTTP_STATUS.NOT_FOUND);
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Perfil obtido com sucesso!',
        data: {
          user
        }
      });
    } catch (error) {
      logger.error('Erro ao obter perfil:', error);
      next(error);
    }
  }

  /**
   * ✏️ Atualizar perfil do usuário
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const updateProfileDto: UpdateProfileDto = req.body;

      if (!userId) {
        throw new AppError('Usuário não autenticado', HTTP_STATUS.UNAUTHORIZED);
      }

      const updatedUser = await this.userService.updateProfile(userId, updateProfileDto);

      logger.info(`Perfil atualizado para usuário: ${userId}`);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Perfil atualizado com sucesso!',
        data: {
          user: updatedUser
        }
      });
    } catch (error) {
      logger.error('Erro ao atualizar perfil:', error);
      next(error);
    }
  }

  /**
   * 🔐 Alterar senha
   */
  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const changePasswordDto: ChangePasswordDto = req.body;

      if (!userId) {
        throw new AppError('Usuário não autenticado', HTTP_STATUS.UNAUTHORIZED);
      }

      await this.authService.changePassword(userId, changePasswordDto);

      logger.info(`Senha alterada para usuário: ${userId}`);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Senha alterada com sucesso!'
      });
    } catch (error) {
      logger.error('Erro ao alterar senha:', error);
      next(error);
    }
  }

  /**
   * 📧 Solicitar recuperação de senha
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const forgotPasswordDto: ForgotPasswordDto = req.body;

      await this.authService.forgotPassword(forgotPasswordDto);

      logger.info(`Recuperação de senha solicitada para: ${forgotPasswordDto.email}`);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Se o email existir, instruções de recuperação foram enviadas.'
      });
    } catch (error) {
      logger.error('Erro na recuperação de senha:', error);
      next(error);
    }
  }

  /**
   * 🔑 Redefinir senha
   */
  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resetPasswordDto: ResetPasswordDto = req.body;

      await this.authService.resetPassword(resetPasswordDto);

      logger.info('Senha redefinida com sucesso');

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Senha redefinida com sucesso!'
      });
    } catch (error) {
      logger.error('Erro ao redefinir senha:', error);
      next(error);
    }
  }

  /**
   * ✅ Verificar email
   */
  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const verifyEmailDto: VerifyEmailDto = req.body;

      await this.authService.verifyEmail(verifyEmailDto);

      logger.info('Email verificado com sucesso');

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Email verificado com sucesso!'
      });
    } catch (error) {
      logger.error('Erro na verificação do email:', error);
      next(error);
    }
  }

  /**
   * 📤 Reenviar verificação de email
   */
  async resendVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resendVerificationDto: ResendVerificationDto = req.body;

      await this.authService.resendVerification(resendVerificationDto);

      logger.info(`Verificação reenviada para: ${resendVerificationDto.email}`);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Se o email existir, nova verificação foi enviada.'
      });
    } catch (error) {
      logger.error('Erro ao reenviar verificação:', error);
      next(error);
    }
  }
}
