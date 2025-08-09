// Enterprise error classes for Will Finance 5.0

export abstract class BaseError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;
  abstract readonly isOperational: boolean;

  constructor(message: string, public readonly context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends BaseError {
  readonly statusCode = 400;
  readonly code = 'VALIDATION_ERROR';
  readonly isOperational = true;

  constructor(message: string, public readonly fields: string[] = []) {
    super(message);
  }
}

export class NotFoundError extends BaseError {
  readonly statusCode = 404;
  readonly code = 'NOT_FOUND';
  readonly isOperational = true;
}

export class InternalServerError extends BaseError {
  readonly statusCode = 500;
  readonly code = 'INTERNAL_SERVER_ERROR';
  readonly isOperational = false;
}
