import { Router, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { prisma } from '@/config/database';
import { logger } from '@/utils/logger';
import bcrypt from 'bcryptjs';

const router = Router();

// Google OAuth Client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.CLIENT_URL || 'http://localhost:5174'}/auth/google/callback`
);

interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  id_token: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

/**
 * Callback do Google OAuth
 * Processa o código de autorização e retorna dados do usuário
 */
router.post('/callback', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      res.status(400).json({
        status: 'error',
        message: 'Código de autorização é obrigatório'
      });
      return;
    }

    logger.info('🔥 Processando Google OAuth callback', { code: code.substring(0, 10) + '...' });

    // Configurar cliente OAuth com redirect URI correto
    oauth2Client.setCredentials({});
    
    // Trocar código por tokens
    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: redirectUri
    });

    if (!tokens.access_token || !tokens.id_token) {
      throw new Error('Tokens inválidos recebidos do Google');
    }

    // Verificar e decodificar ID token
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID as string
    });

    const payload = ticket.getPayload();
    
    if (!payload) {
      throw new Error('Payload do token inválido');
    }

    const googleUser: GoogleUserInfo = {
      id: payload.sub || '',
      email: payload.email || '',
      name: payload.name || '',
      picture: payload.picture || '',
      given_name: payload.given_name || '',
      family_name: payload.family_name || ''
    };

    logger.info('🔥 Dados do usuário Google obtidos', { email: googleUser.email });

    // Buscar ou criar usuário no banco
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email }
    });

    if (!user) {
      // Criar novo usuário
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 12);
      
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          username: googleUser.email.split('@')[0] + '_' + Math.random().toString(36).substring(7),
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          password: randomPassword, // Senha aleatória (usuário não usará)
          avatar: googleUser.picture,
          emailVerified: true, // Google já verificou
          emailVerifiedAt: new Date(),
        }
      });

      logger.info('🔥 Novo usuário criado via Google', { userId: user.id, email: user.email });
    } else {
      // Atualizar último login e avatar se necessário
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          avatar: googleUser.picture, // Atualizar avatar
          emailVerified: true,
          emailVerifiedAt: user.emailVerifiedAt || new Date(),
        }
      });

      logger.info('🔥 Usuário existente logado via Google', { userId: user.id, email: user.email });
    }

    // Gerar tokens JWT
    const accessToken = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        type: 'access'
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        type: 'refresh'
      },
      process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
      { expiresIn: '7d' }
    );

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = user;

    res.json({
      status: 'success',
      message: 'Login com Google realizado com sucesso',
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken
      }
    });

  } catch (error: any) {
    logger.error('🔥 Erro no Google OAuth callback', error);
    
    res.status(400).json({
      status: 'error',
      message: error.message || 'Erro no processo de autenticação com Google'
    });
  }
});

/**
 * Rota para trocar código por token (alternativa)
 */
router.post('/exchange', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.body;

    if (!code) {
      res.status(400).json({
        status: 'error',
        message: 'Código de autorização é obrigatório'
      });
      return;
    }

    // Trocar código por tokens
    const { tokens } = await oauth2Client.getToken(code);

    res.json({
      status: 'success',
      data: tokens
    });

  } catch (error: any) {
    logger.error('🔥 Erro ao trocar código por token', error);
    
    res.status(400).json({
      status: 'error',
      message: 'Erro ao trocar código por token'
    });
  }
});

/**
 * Rota para obter URL de autorização
 */
router.get('/auth-url', (req: Request, res: Response) => {
  try {
    const scopes = [
      'openid',
      'email',
      'profile'
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state: Math.random().toString(36).substring(7)
    });

    res.json({
      status: 'success',
      data: {
        authUrl,
        clientId: process.env.GOOGLE_CLIENT_ID
      }
    });

  } catch (error: any) {
    logger.error('🔥 Erro ao gerar URL de autorização', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Erro ao gerar URL de autorização'
    });
  }
});

export default router;
