import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface CustomError extends Error {
  statusCode?: number;
  status?: number;
}

export const globalExceptionHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let status = 500;
  let message = 'Internal server error';
  let errorType = 'Internal Server Error';

  // Handle different types of exceptions
  if (error.statusCode || error.status) {
    status = error.statusCode || error.status || 500;
    message = error.message || message;
  } else if (error.code) {
    // Handle Prisma specific errors by error code
    status = 400;
    errorType = 'Database Error';
    
    switch (error.code) {
      case 'P2002':
        message = 'A record with this data already exists';
        status = 409;
        break;
      case 'P2025':
        message = 'Record not found';
        status = 404;
        break;
      case 'P2003':
        message = 'Foreign key constraint failed';
        break;
      case 'P2014':
        message = 'The change you are trying to make would violate the required relation';
        break;
      default:
        if (error.code.startsWith('P')) {
          message = 'Database operation failed';
        }
    }
  } else if (error.name === 'PrismaClientValidationError') {
    status = 400;
    errorType = 'Validation Error';
    message = 'Invalid data provided';
  } else if (error instanceof Error) {
    message = error.message;
  }

  const errorResponse = {
    statusCode: status,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method,
    error: errorType,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
    }),
  };

  // Log the error
  logger.error(
    `${req.method} ${req.url} - ${status} - ${message}`,
    error.stack || 'No stack trace available'
  );

  res.status(status).json(errorResponse);
};
