import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error & { statusCode?: number },
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // eslint-disable-next-line no-console
  console.error('Error:', error);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};
