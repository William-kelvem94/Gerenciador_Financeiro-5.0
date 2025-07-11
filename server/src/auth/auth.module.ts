import { Router } from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth';

/**
 * Módulo de Autenticação
 * 
 * Este módulo centraliza as configurações de autenticação JWT para o projeto.
 * Fornece guards, decorators e middlewares para proteger rotas.
 */

export class AuthModule {
  /**
   * Aplica autenticação obrigatória em uma rota
   */
  static requireAuth() {
    return authenticateToken;
  }

  /**
   * Aplica autenticação opcional em uma rota
   */
  static optionalAuth() {
    return optionalAuth;
  }

  /**
   * Cria um router protegido por autenticação
   */
  static createProtectedRouter(): Router {
    const router = Router();
    router.use(authenticateToken);
    return router;
  }

  /**
   * Cria um router com autenticação opcional
   */
  static createOptionalAuthRouter(): Router {
    const router = Router();
    router.use(optionalAuth);
    return router;
  }
}

// Exportações convenientes
export { jwtAuthGuard, optionalJwtAuth } from './guards/jwt-auth.guard';
export { Public } from './decorators/public.decorator';
export * from './strategies/jwt.strategy';
export { authenticateToken, optionalAuth } from '../middleware/auth';

export default AuthModule;
