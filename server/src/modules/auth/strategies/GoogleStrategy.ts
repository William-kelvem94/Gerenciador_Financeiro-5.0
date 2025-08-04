/**
 * 🔗 Estratégia Google OAuth - Will Finance 5.0
 */

import fetch from 'node-fetch';
import { randomBytes } from 'crypto';
import { URLSearchParams } from 'url';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { TokenService } from '../services/TokenService';
import { GoogleUserDto, AuthResponseDto } from '../dtos';
import { AppError } from '../../../shared/errors/AppError';
import { HTTP_STATUS } from '../../../shared/constants/httpStatus';
import { logger } from '../../../utils/logger';

interface GoogleOAuthErrorResponse {
  error?: string;
  error_description?: string;
}

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  verified_email?: boolean;
  error?: {
    message?: string;
  };
}

export class GoogleStrategy {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
    private readonly _tokenService: TokenService
  ) {
    // Validar variáveis de ambiente obrigatórias
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new AppError('Configuração do Google OAuth incompleta', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    this.clientId = process.env.GOOGLE_CLIENT_ID;
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    this.redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8080/api/auth/google/callback';
  }

  /**
   * 🔍 Getters para acessar os serviços
   */
  private get authService(): AuthService {
    return this._authService;
  }

  private get userService(): UserService {
    return this._userService;
  }

  private get tokenService(): TokenService {
    return this._tokenService;
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
    if (!code) {
      throw new AppError('Código de autorização não fornecido', HTTP_STATUS.BAD_REQUEST);
    }

    try {
      // 1. Trocar código por tokens
      const tokens = await this.exchangeCodeForTokens(code);
      
      // 2. Obter dados do usuário
      const googleUser = await this.getUserData(tokens.access_token);
      
      // 3. Processar autenticação
      return await this.processAuthentication(googleUser);
      
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      logger.error('Erro no callback do Google:', error);
      
      if (error instanceof Error && error.message.includes('invalid_grant')) {
        throw new AppError('Código de autorização inválido ou expirado', HTTP_STATUS.UNAUTHORIZED);
      }
      
      throw new AppError('Falha na autenticação Google', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🔄 Trocar código por tokens
   */
  private async exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
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
        }).toString()
      });

      const tokens = await response.json() as GoogleTokenResponse & GoogleOAuthErrorResponse;

      if (!response.ok) {
        const errorMessage = tokens.error_description || tokens.error || 'Erro ao obter tokens do Google';
        
        if (errorMessage.includes('invalid_grant')) {
          throw new AppError('Código de autorização inválido ou expirado', HTTP_STATUS.UNAUTHORIZED);
        }
        
        throw new AppError(errorMessage, HTTP_STATUS.BAD_REQUEST);
      }

      return tokens;
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      logger.error('Erro ao trocar código por tokens:', error);
      throw new AppError('Falha na comunicação com Google OAuth', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 👤 Obter dados do usuário do Google
   */
  private async getUserData(accessToken: string): Promise<GoogleUserDto> {
    if (!accessToken) {
      throw new AppError('Token de acesso não fornecido', HTTP_STATUS.BAD_REQUEST);
    }

    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userData = await response.json() as GoogleUserInfo;

      if (!response.ok) {
        throw new AppError(
          userData.error?.message || 'Erro ao obter dados do usuário Google',
          HTTP_STATUS.BAD_REQUEST
        );
      }

      // Validar dados essenciais
      if (!userData.email || !userData.id) {
        throw new AppError('Dados incompletos do usuário Google', HTTP_STATUS.BAD_REQUEST);
      }

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name || '',
        picture: userData.picture || '',
        verified_email: userData.verified_email || false
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      logger.error('Erro ao obter dados do usuário:', error);
      throw new AppError('Falha na comunicação com Google API', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🔐 Processar autenticação (login ou registro)
   */
  private async processAuthentication(googleUser: GoogleUserDto): Promise<AuthResponseDto> {
    try {
      // Verificar se usuário já existe pelo Google ID
      let user = await this.userService.findByGoogleId(googleUser.id);
      
      if (user) {
        // Usuário já existe - fazer login
        logger.info(`Login Google para usuário existente: ${googleUser.email}`);
        
        // Atualizar último login
        await this.userService.updateLastLogin(user.id);
        
        // Gerar tokens
        const tokens = await this.tokenService.generateTokens(user.id, user.email);
        
        return {
          user: this.userService.sanitizeUser(user),
          tokens
        };
      }
      
      // Verificar se existe usuário com o mesmo email
      user = await this.userService.findByEmail(googleUser.email);
      
      if (user) {
        // Vincular conta Google ao usuário existente
        logger.info(`Vinculando conta Google ao usuário: ${googleUser.email}`);
        
        await this.linkGoogleAccount(user.id, googleUser);
        user = await this.userService.findById(user.id);
        
        if (!user) {
          throw new AppError('Erro ao vincular conta', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        
        // Gerar tokens
        const tokens = await this.tokenService.generateTokens(user.id, user.email);
        
        return {
          user: this.userService.sanitizeUser(user),
          tokens
        };
      }
      
      // Criar novo usuário
      logger.info(`Criando novo usuário via Google: ${googleUser.email}`);
      
      user = await this.userService.create({
        name: googleUser.name,
        email: googleUser.email,
        password: this.generateRandomPassword(), // Senha aleatória (não será usada)
        avatar: googleUser.picture,
        googleId: googleUser.id
      });
      
      // Marcar email como verificado se o Google confirma
      if (googleUser.verified_email) {
        await this.userService.verifyEmail(user.id);
        user = await this.userService.findById(user.id);
      }
      
      if (!user) {
        throw new AppError('Erro ao criar usuário', HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }
      
      // Gerar tokens
      const tokens = await this.tokenService.generateTokens(user.id, user.email);
      
      return {
        user: this.userService.sanitizeUser(user),
        tokens
      };
      
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      logger.error('Erro ao processar autenticação:', error);
      throw new AppError('Falha na autenticação Google', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🔗 Vincular conta Google a usuário existente
   */
  private async linkGoogleAccount(userId: string, googleUser: GoogleUserDto): Promise<void> {
    try {
      // Atualizar dados do usuário com informações do Google
      await this.userService.updateProfile(userId, {
        avatar: googleUser.picture
      });
      
      // Atualizar último login já que estamos vinculando a conta
      await this.userService.updateLastLogin(userId);
      
      logger.info(`Conta Google vinculada para usuário: ${userId}`);
    } catch (error) {
      logger.error('Erro ao vincular conta Google:', error);
      throw new AppError('Erro ao vincular conta Google', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 🎲 Gerar senha aleatória para usuários Google
   */
  private generateRandomPassword(): string {
    return randomBytes(16).toString('hex') + '!@#';
  }
}
