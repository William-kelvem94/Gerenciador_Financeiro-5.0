export declare abstract class BaseError extends Error {
    abstract readonly statusCode: number;
    abstract readonly code: string;
    abstract readonly isOperational: boolean;
    readonly context?: Record<string, unknown>;
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class ValidationError extends BaseError {
    readonly statusCode = 400;
    readonly code = "VALIDATION_ERROR";
    readonly isOperational = true;
    readonly fields: string[];
    constructor(message: string, fields?: string[]);
}
export declare class NotFoundError extends BaseError {
    readonly statusCode = 404;
    readonly code = "NOT_FOUND";
    readonly isOperational = true;
}
export declare class UnauthorizedError extends BaseError {
    readonly statusCode = 401;
    readonly code = "UNAUTHORIZED";
    readonly isOperational = true;
}
export declare class ForbiddenError extends BaseError {
    readonly statusCode = 403;
    readonly code = "FORBIDDEN";
    readonly isOperational = true;
}
export declare class InternalServerError extends BaseError {
    readonly statusCode = 500;
    readonly code = "INTERNAL_SERVER_ERROR";
    readonly isOperational = false;
}
