"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const base_error_1 = require("../shared/errors/base.error");
const logger_1 = require("../shared/utils/logger");
function errorHandler(err, req, res, next) {
    logger_1.logger.error('Erro capturado pelo errorHandler', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        userId: req.user?.id,
        timestamp: new Date().toISOString(),
    });
    if (err instanceof base_error_1.BaseError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        });
    }
    else {
        res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === 'production'
                ? 'Erro interno do servidor'
                : err.message,
            code: 'INTERNAL_SERVER_ERROR',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        });
    }
}
//# sourceMappingURL=error.middleware.js.map