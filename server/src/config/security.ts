/**
 * Configurações de Segurança do Sistema
 * 
 * Este arquivo centraliza todas as configurações relacionadas à segurança,
 * incluindo JWT, CORS, Rate Limiting, e outras medidas de proteção.
 */

export const SecurityConfig = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: 'will-finance-app',
    audience: 'will-finance-users',
  },

  // Password Configuration
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    authEndpoints: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // 5 login attempts per window
    },
    apiEndpoints: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 1000, // 1000 API calls per window
    },
  },

  // CORS Configuration
  cors: {
    origin: [
      'http://localhost:5173', // Vite dev server
      'http://localhost:5174', // Vite alternative port
      'http://localhost:3000', // React dev server
      'http://localhost:8080', // Production client
      process.env.CLIENT_URL || 'http://localhost:5173',
      process.env.FRONTEND_URL || 'http://localhost:5173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-API-Key',
    ],
  },

  // Content Security Policy
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", 'ws:', 'wss:', 'https:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },

  // File Upload Security
  fileUpload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    allowedExtensions: [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.pdf',
      '.csv',
      '.xls',
      '.xlsx',
    ],
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    scanForMalware: process.env.NODE_ENV === 'production',
  },

  // Session Security
  session: {
    name: 'will-finance-session',
    secret: process.env.COOKIE_SECRET || 'default-cookie-secret-change-in-production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    sameSite: 'lax' as const,
  },

  // API Security
  api: {
    maxRequestSize: '10mb',
    timeoutMs: 30000, // 30 seconds
    enableEtag: true,
    trustProxy: process.env.NODE_ENV === 'production',
    poweredByHeader: false, // Hide X-Powered-By header
  },

  // Validation Rules
  validation: {
    email: {
      maxLength: 254,
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    username: {
      minLength: 3,
      maxLength: 30,
      regex: /^[a-zA-Z0-9_-]+$/,
    },
    currency: {
      length: 3,
      regex: /^[A-Z]{3}$/,
    },
    uuid: {
      regex: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    },
  },

  // Audit and Logging
  audit: {
    enabled: true,
    sensitiveFields: [
      'password',
      'refreshToken',
      'accessToken',
      'secret',
      'key',
      'private',
    ],
    logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
    maxLogSize: '100mb',
    retentionDays: 90,
  },

  // Feature Flags for Security
  features: {
    enableTwoFactor: false, // TODO: Implement 2FA
    enableAccountLockout: true,
    enablePasswordHistory: false, // TODO: Implement password history
    enableDeviceTracking: false, // TODO: Implement device tracking
    enableGeolocation: false, // TODO: Implement geo-based security
    enableAuditLog: true,
    enableRealTimeAlerts: false, // TODO: Implement real-time security alerts
  },

  // Security Headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  },

  // Environment Specific Overrides
  development: {
    enableDetailedErrors: true,
    enableSQLLogging: true,
    enableDebugRoutes: true,
    disableRateLimit: false, // Keep rate limiting even in dev
  },

  production: {
    enableDetailedErrors: false,
    enableSQLLogging: false,
    enableDebugRoutes: false,
    requireHTTPS: true,
    enableCompression: true,
  },
};

/**
 * Validates security configuration on startup
 */
export const validateSecurityConfig = (): void => {
  const errors: string[] = [];

  // Check required environment variables
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'default-secret-change-in-production') {
    errors.push('JWT_SECRET must be set to a secure value in production');
  }

  if (!process.env.COOKIE_SECRET || process.env.COOKIE_SECRET === 'default-cookie-secret-change-in-production') {
    errors.push('COOKIE_SECRET must be set to a secure value in production');
  }

  // Check JWT secret strength
  if (SecurityConfig.jwt.secret.length < 32) {
    errors.push('JWT_SECRET should be at least 32 characters long');
  }

  // Production-specific checks
  if (process.env.NODE_ENV === 'production') {
    if (!SecurityConfig.session.secure) {
      errors.push('Session cookies must be secure in production (HTTPS required)');
    }

    if (SecurityConfig.development.enableDetailedErrors) {
      errors.push('Detailed errors should be disabled in production');
    }
  }

  if (errors.length > 0) {
    console.error('Security Configuration Errors:');
    errors.forEach(error => console.error(`- ${error}`));
    
    if (process.env.NODE_ENV === 'production') {
      process.exit(1); // Exit in production if security config is invalid
    } else {
      console.warn('Warning: Security configuration issues detected in development mode');
    }
  }
};

export default SecurityConfig;
