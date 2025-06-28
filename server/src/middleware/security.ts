import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { AuthenticatedRequest } from '../auth/strategies/jwt.strategy';

export interface AuditLogData {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  method: string;
  url: string;
  userAgent?: string;
  ip: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Middleware para auditoria de ações importantes
 */
export const auditLogger = (action: string, resource: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log apenas em caso de sucesso (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const auditData: AuditLogData = {
          userId: req.user?.userId ?? undefined,
          action,
          resource,
          resourceId: req.params.id ?? undefined,
          method: req.method,
          url: req.originalUrl,
          userAgent: req.get('User-Agent') ?? undefined,
          ip: req.ip ?? req.socket.remoteAddress ?? 'unknown',
          timestamp: new Date(),
          metadata: {
            body: req.body,
            params: req.params,
            query: req.query,
          },
        };

        // Log apenas dados essenciais para auditoria
        logger.info('AUDIT_LOG', {
          userId: auditData.userId,
          action: auditData.action,
          resource: auditData.resource,
          resourceId: auditData.resourceId,
          method: auditData.method,
          url: auditData.url,
          ip: auditData.ip,
          timestamp: auditData.timestamp,
        });

        // Em um sistema real, isso seria salvo em uma tabela de auditoria
        // await saveAuditLog(auditData);
      }

      return originalSend.call(this, data);
    };

    next();
  };
};

/**
 * Middleware para log de requisições (desenvolvimento)
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[logLevel]('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip ?? req.socket.remoteAddress,
      contentLength: res.get('Content-Length'),
    });
  });

  next();
};

/**
 * Middleware de rate limiting personalizado
 */
export const createRateLimiter = (windowMs: number, maxRequests: number) => {
  const requests = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const clientId = req.ip ?? req.socket.remoteAddress ?? 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    // Limpar requisições antigas
    if (requests.has(clientId)) {
      const clientRequests = requests.get(clientId)!;
      const validRequests = clientRequests.filter(time => time > windowStart);
      requests.set(clientId, validRequests);
    }

    // Verificar limite
    const clientRequests = requests.get(clientId) || [];
    if (clientRequests.length >= maxRequests) {
      logger.warn('Rate limit exceeded', {
        clientId,
        requestCount: clientRequests.length,
        maxRequests,
        windowMs,
        url: req.originalUrl,
        method: req.method,
      });

      res.status(429).json({
        status: 'error',
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000),
      });
      return;
    }

    // Adicionar nova requisição
    clientRequests.push(now);
    requests.set(clientId, clientRequests);

    // Adicionar headers informativos
    res.set({
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': (maxRequests - clientRequests.length).toString(),
      'X-RateLimit-Reset': new Date(now + windowMs).toISOString(),
    });

    next();
  };
};

/**
 * Middleware para sanitização de dados de entrada
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitizar strings no body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  // Sanitizar query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }

  next();
};

/**
 * Função auxiliar para sanitizar objetos
 */
const sanitizeObject = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Remove caracteres perigosos para XSS
      sanitized[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .trim();
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Middleware para validação de Content-Type
 */
export const validateContentType = (allowedTypes: string[] = ['application/json']) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET' || req.method === 'DELETE') {
      return next();
    }

    const contentType = req.get('Content-Type');
    if (!contentType || !allowedTypes.some(type => contentType.includes(type))) {
      return res.status(415).json({
        status: 'error',
        message: `Unsupported Media Type. Expected one of: ${allowedTypes.join(', ')}`,
      });
    }

    next();
  };
};

/**
 * Middleware para timeout de requisições
 */
export const requestTimeout = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        logger.warn('Request timeout', {
          method: req.method,
          url: req.originalUrl,
          timeout: timeoutMs,
          ip: req.ip,
        });

        res.status(408).json({
          status: 'error',
          message: 'Request timeout',
        });
      }
    }, timeoutMs);

    res.on('finish', () => {
      clearTimeout(timeout);
    });

    next();
  };
};
