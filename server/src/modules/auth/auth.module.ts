/**
 * 🔐 Módulo de Autenticação - Will Finance 5.0
 * 
 * Centraliza toda a lógica de autenticação, autorização e gerenciamento de usuários
 * Inclui: JWT, Google OAuth, rate limiting específico, validações
 */

import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { AuthService } from './services/AuthService';
import { UserService } from './services/UserService';
import { TokenService } from './services/TokenService';
import { GoogleStrategy } from './strategies/GoogleStrategy';
import { authLimiter } from './middleware/authLimiter';
import { validateAuth } from './middleware/validateAuth';
import { authenticateToken } from '../../shared/middleware/authenticateToken';

export class AuthModule {
  public router: Router;
  private authController: AuthController;
  private authService: AuthService;
  private userService: UserService;
  private tokenService: TokenService;
  private googleStrategy: GoogleStrategy;

  constructor() {
    this.router = Router();
    this.initializeServices();
    this.initializeControllers();
    this.initializeRoutes();
  }

  private initializeServices(): void {
    this.tokenService = new TokenService();
    this.userService = new UserService();
    this.authService = new AuthService(this.userService, this.tokenService);
    this.googleStrategy = new GoogleStrategy(this.authService, this.userService, this.tokenService);
  }

  private initializeControllers(): void {
    this.authController = new AuthController(
      this.authService,
      this.userService,
      this.googleStrategy
    );
  }

  private initializeRoutes(): void {
    // 🔐 Rotas de autenticação
    this.router.post(
      '/register',
      authLimiter,
      validateAuth.register,
      this.authController.register.bind(this.authController)
    );

    this.router.post(
      '/login',
      authLimiter,
      validateAuth.login,
      this.authController.login.bind(this.authController)
    );

    this.router.post(
      '/refresh-token',
      authLimiter,
      validateAuth.refreshToken,
      this.authController.refreshToken.bind(this.authController)
    );

    this.router.post(
      '/logout',
      authenticateToken,
      this.authController.logout.bind(this.authController)
    );

    // 🔐 Google OAuth
    this.router.get(
      '/google',
      this.authController.googleAuth.bind(this.authController)
    );

    this.router.get(
      '/google/callback',
      this.authController.googleCallback.bind(this.authController)
    );

    // 👤 Gerenciamento de perfil
    this.router.get(
      '/profile',
      authenticateToken,
      this.authController.getProfile.bind(this.authController)
    );

    this.router.put(
      '/profile',
      authenticateToken,
      validateAuth.updateProfile,
      this.authController.updateProfile.bind(this.authController)
    );

    this.router.put(
      '/change-password',
      authenticateToken,
      validateAuth.changePassword,
      this.authController.changePassword.bind(this.authController)
    );

    // 🔐 Recuperação de senha
    this.router.post(
      '/forgot-password',
      authLimiter,
      validateAuth.forgotPassword,
      this.authController.forgotPassword.bind(this.authController)
    );

    this.router.post(
      '/reset-password',
      authLimiter,
      validateAuth.resetPassword,
      this.authController.resetPassword.bind(this.authController)
    );

    // ✅ Verificação de email
    this.router.post(
      '/verify-email',
      authLimiter,
      validateAuth.verifyEmail,
      this.authController.verifyEmail.bind(this.authController)
    );

    this.router.post(
      '/resend-verification',
      authLimiter,
      validateAuth.resendVerification,
      this.authController.resendVerification.bind(this.authController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
