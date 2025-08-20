import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
	statusCode?: number;
	code?: string;
	details?: any;
}

/**
 * Middleware global de tratamento de erros para Express.
 * Enterprise: log estruturado, resposta padronizada e filtragem de detalhes sensíveis.
 */
const errorHandler = (
	err: unknown,
	req: Request,
	res: Response,
	_next: NextFunction
) => {
	// Normaliza o erro para garantir que seja um objeto Error
	const error = (() => {
		if (err instanceof Error) return err as AppError;
		return new Error(typeof err === 'string' ? err : 'Erro desconhecido');
	})();

	// Log estruturado do erro com contexto adicional
	console.error({
		message: 'Unhandled error',
		error: error.stack || error.message,
		requestId: req.headers['x-request-id'],
		method: req.method,
		path: req.path,
		timestamp: new Date().toISOString(),
		...(process.env.NODE_ENV === 'development' && { fullError: err })
	});

	// Resposta padronizada ao cliente
	res.status((error as AppError).statusCode || 500).json({
		success: false,
		error: {
			code: (error as AppError).code || 'INTERNAL_SERVER_ERROR',
			message: error.message || 'Erro interno do servidor',
			...(process.env.NODE_ENV === 'development' && {
				details: (error as AppError).details
			}),
			...(process.env.NODE_ENV === 'development' && {
				stackTrace: error.stack
			})
		},
		timestamp: new Date().toISOString(),
		requestId: req.headers['x-request-id'] || '',
		correlationId: req.headers['x-correlation-id'] || '',
		pathInfo: `${req.method} ${req.path}`
	});
};

export default errorHandler;
