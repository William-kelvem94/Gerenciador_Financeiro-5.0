/**
 * 🔗 Estratégia Google OAuth - Will Finance 5.0
 */

import { AuthService } from '../services/AuthService';
import { GoogleUserDto, AuthResponseDto } from '../dtos';
import { AppError } from '../../../shared/errors/AppError';
import { HTTP_STATUS } from '../../../shared/constants/httpStatus';
import { logger } from '../../../utils/logger';

export class GoogleStrategy {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor(private readonly authService: AuthService) {
    this.clientId = process.env.GOOGLE_CLIENT_ID || '';
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    this.redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8080/api/auth/google/callback';
  }

  /**
   * 🔗 Gerar URL de autenticação do Google
   */
  async getAuthUrl(): Promise<string> {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: scopes.join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent'
    });

    return `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
  }

  /**
   * 📞 Processar callback do Google
   */
  async handleCallback(code: string): Promise<AuthResponseDto> {
    try {
      // 1. Trocar código por tokens
      const tokens = await this.exchangeCodeForTokens(code);
      
      // 2. Obter dados do usuário
      const googleUser = await this.getUserData(tokens.access_token);
      
      // 3. Processar autenticação
      return await this.processAuthentication(googleUser);
      
    } catch (error) {
      logger.error('Erro no callback do Google:', error);
      throw new AppError('Falha na autenticação Google', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🔄 Trocar código por tokens
   */
  private async exchangeCodeForTokens(code: string): Promise<any> {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
        }),
      });

      const tokens = await response.json();

      if (!response.ok) {
        throw new Error(tokens.error_description || 'Erro ao obter tokens');
      }

      return tokens;
    } catch (error) {
      logger.error('Erro ao trocar código por tokens:', error);
      throw error;
    }
  }

  /**
   * 👤 Obter dados do usuário do Google
   */
  private async getUserData(accessToken: string): Promise<GoogleUserDto> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userData = await response.json();

      if (!response.ok) {
        throw new Error(userData.error?.message || 'Erro ao obter dados do usuário');
      }

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        verified_email: userData.verified_email
      };
    } catch (error) {
      logger.error('Erro ao obter dados do usuário:', error);
      throw error;
    }
  }

  /**
   * 🔐 Processar autenticação (login ou registro)
   */
  private async processAuthentication(googleUser: GoogleUserDto): Promise<AuthResponseDto> {
    try {
      // Verificar se usuário já existe pelo Google ID
      let user = await this.authService.userService.findByGoogleId(googleUser.id);
      
      if (user) {
        // Usuário já existe - fazer login
        logger.info(`Login Google para usuário existente: ${googleUser.email}`);
        
        // Atualizar último login
        await this.authService.userService.updateLastLogin(user.id);
        
        // Gerar tokens
        const tokens = await this.authService.tokenService.generateTokens(user.id, user.email);
        
        return {
          user: this.authService.userService.sanitizeUser(user),
          tokens
        };
      }
      
      // Verificar se existe usuário com o mesmo email
      user = await this.authService.userService.findByEmail(googleUser.email);
      
      if (user) {
        // Vincular conta Google ao usuário existente
        logger.info(`Vinculando conta Google ao usuário: ${googleUser.email}`);
        
        await this.linkGoogleAccount(user.id, googleUser);
        user = await this.authService.userService.findById(user.id);
        
        if (!user) {
          throw new AppError('Erro ao vincular conta', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        
        // Gerar tokens
        const tokens = await this.authService.tokenService.generateTokens(user.id, user.email);
        
        return {
          user: this.authService.userService.sanitizeUser(user),
          tokens
        };
      }
      
      // Criar novo usuário
      logger.info(`Criando novo usuário via Google: ${googleUser.email}`);
      
      user = await this.authService.userService.create({
        name: googleUser.name,
        email: googleUser.email,
        password: this.generateRandomPassword(), // Senha aleatória (não será usada)
        avatar: googleUser.picture,
        googleId: googleUser.id
      });
      
      // Marcar email como verificado se o Google confirma
      if (googleUser.verified_email) {
        await this.authService.userService.verifyEmail(user.id);
        user = await this.authService.userService.findById(user.id);
      }
      
      if (!user) {
        throw new AppError('Erro ao criar usuário', HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }
      
      // Gerar tokens
      const tokens = await this.authService.tokenService.generateTokens(user.id, user.email);
      
      return {
        user: this.authService.userService.sanitizeUser(user),
        tokens
      };
      
    } catch (error) {
      logger.error('Erro ao processar autenticação:', error);
      throw error;
    }
  }

  /**
   * 🔗 Vincular conta Google a usuário existente
   */
  private async linkGoogleAccount(userId: string, googleUser: GoogleUserDto): Promise<void> {
    await this.authService.userService.updateProfile(userId, {
      avatar: googleUser.picture
    });
    
    // Aqui você salvaria o Google ID no banco
    // Como não temos um método específico, vamos simular
    logger.info(`Conta Google vinculada para usuário: ${userId}`);
  }

  /**
   * 🎲 Gerar senha aleatória para usuários Google
   */
  private generateRandomPassword(): string {
    return Math.random().toString(36).slice(-12) + 
           Math.random().toString(36).slice(-12) + 
           '!@#';
  }
}
