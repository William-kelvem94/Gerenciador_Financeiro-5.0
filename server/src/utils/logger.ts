import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Helper function to format message
const formatMessage = (message: unknown): string => {
  if (message === null || message === undefined) {
    return '';
  }
  
  if (typeof message === 'object') {
    return JSON.stringify(message, null, 2);
  }
  
  if (typeof message === 'string') {
    return message;
  }
  
  if (typeof message === 'number' || typeof message === 'boolean') {
    return String(message);
  }
  
  return '[object Object]';
};

// Helper function to format timestamp
const formatTimestamp = (timestamp: unknown): string => {
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  return JSON.stringify(timestamp);
};

// Choose the aspect of your log customizing the log format.
const format = winston.format.combine(
  // Add the message timestamp with the preferred format
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // Tell Winston that the logs must be colored
  winston.format.colorize({ all: true }),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf((info) => {
    const message = formatMessage(info.message);
    const timestamp = formatTimestamp(info.timestamp);
    return `${timestamp} ${info.level}: ${message}`;
  })
);

// JSON format for file logs
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define which transports the logger must use to print out messages.
const transports = [
  // Allow the use the console to print the messages
  new winston.transports.Console({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  }),
  // Allow to print all the error level messages inside the error.log file
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    format: jsonFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  // Allow to print all messages inside the combined.log file
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    format: jsonFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 10,
  }),
  // HTTP requests log
  new winston.transports.File({
    filename: path.join(logsDir, 'http.log'),
    level: 'http',
    format: jsonFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Create the logger instance that has to be exported
// and to be used to log messages.
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'debug' : 'info'),
  levels,
  format,
  transports,
  defaultMeta: {
    service: 'will-finance-server',
    version: process.env.npm_package_version || '5.0.0',
  },
});

// Request logging middleware
export const requestLogger = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log request
  logger.http('HTTP Request', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id,
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.http('HTTP Response', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id,
    });

    // Log slow requests
    if (duration > 1000) {
      logger.warn('Slow Request', {
        method: req.method,
        url: req.url,
        duration: `${duration}ms`,
        userId: req.user?.id,
      });
    }
  });

  next();
};

// Application metrics
export const metrics = {
  // Track user actions
  userAction: (action: string, userId: string, metadata?: Record<string, unknown>) => {
    logger.info('User Action', {
      action,
      userId,
      ...metadata,
    });
  },

  // Track errors
  error: (error: Error, context?: string, userId?: string) => {
    logger.error('Application Error', {
      error: error.message,
      stack: error.stack,
      context,
      userId,
    });
  },

  // Track authentication events
  auth: (event: 'login' | 'logout' | 'register' | 'failed_login', userId?: string, ip?: string) => {
    logger.info('Auth Event', {
      event,
      userId,
      ip,
    });
  },
};

// Utility functions for different log levels
export const logInfo = (message: string, meta?: Record<string, unknown>) => {
  logger.info(message, meta);
};

export const logError = (message: string, error?: Error) => {
  logger.error(message, error);
};

export const logWarn = (message: string, meta?: Record<string, unknown>) => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: Record<string, unknown>) => {
  logger.debug(message, meta);
};

export const logHttp = (message: string, meta?: Record<string, unknown>) => {
  logger.http(message, meta);
};
