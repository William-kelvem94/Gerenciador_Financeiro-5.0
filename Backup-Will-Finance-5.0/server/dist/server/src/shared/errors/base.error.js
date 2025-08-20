"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.ValidationError = exports.BaseError = void 0;
class BaseError extends Error {
    context;
    constructor(message, context) {
        super(message);
        this.name = this.constructor.name;
        this.context = context;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.BaseError = BaseError;
class ValidationError extends BaseError {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    isOperational = true;
    fields;
    constructor(message, fields = []) {
        super(message);
        this.fields = fields;
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends BaseError {
    statusCode = 404;
    code = 'NOT_FOUND';
    isOperational = true;
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends BaseError {
    statusCode = 401;
    code = 'UNAUTHORIZED';
    isOperational = true;
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends BaseError {
    statusCode = 403;
    code = 'FORBIDDEN';
    isOperational = true;
}
exports.ForbiddenError = ForbiddenError;
class InternalServerError extends BaseError {
    statusCode = 500;
    code = 'INTERNAL_SERVER_ERROR';
    isOperational = false;
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=base.error.js.map