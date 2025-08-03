/**
 * 🔒 Rate Limiter para Autenticação - Will Finance 5.0
 */

import rateLimit from 'express-rate-limit';
import { HTTP_STATUS } from '../../../shared/constants/httpStatus';

// Rate limiter específico para operações de autenticação
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 tentativas por IP por janela
  message: {
    success: false,
    message: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  skip: (req) => {
    // Pular rate limiting para IPs em whitelist (opcional)
    const whitelistedIPs = process.env.RATE_LIMIT_WHITELIST?.split(',') || [];
    const clientIP = req.ip || req.connection.remoteAddress;
    return whitelistedIPs.includes(clientIP || '');
  }
});

// Rate limiter para operações de senha
export const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Máximo 3 tentativas de reset/change por hora
  message: {
    success: false,
    message: 'Muitas tentativas de alteração de senha. Tente novamente em 1 hora.',
    error: 'PASSWORD_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS
});

// Rate limiter para registro de usuários
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Máximo 3 registros por IP por hora
  message: {
    success: false,
    message: 'Muitas tentativas de registro. Tente novamente em 1 hora.',
    error: 'REGISTER_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS
});
