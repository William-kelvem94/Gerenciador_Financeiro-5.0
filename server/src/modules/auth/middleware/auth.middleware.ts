import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// Definição direta do tipo UserPayload para evitar erro de importação
export interface UserPayload {
    userId: string;
    email: string;
    role: 'USER' | 'ADMIN' | 'MASTER';
    permissions: string[];
    iat?: number;
    exp?: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

/**
 * Middleware de autenticação JWT enterprise
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Token não fornecido' }
        });
    }

    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
        req.user = decoded;
        next();
    } catch (error: any) {
        return res.status(401).json({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Token inválido ou expirado' }
        });
    }
}
