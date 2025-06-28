import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    // Handle different types of exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      
      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (typeof errorResponse === 'object' && errorResponse !== null) {
        message = (errorResponse as any).message || exception.message;
        error = (errorResponse as any).error || error;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle Prisma specific errors
      status = HttpStatus.BAD_REQUEST;
      error = 'Database Error';
      
      switch (exception.code) {
        case 'P2002':
          message = 'A record with this data already exists';
          status = HttpStatus.CONFLICT;
          break;
        case 'P2025':
          message = 'Record not found';
          status = HttpStatus.NOT_FOUND;
          break;
        case 'P2003':
          message = 'Foreign key constraint failed';
          break;
        case 'P2014':
          message = 'The change you are trying to make would violate the required relation';
          break;
        default:
          message = 'Database operation failed';
      }
    } else if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'Database Error';
      message = 'Unknown database error occurred';
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      error = 'Validation Error';
      message = 'Invalid data provided';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : 'No stack trace available'
    );

    response.status(status).json(errorResponse);
  }
}
