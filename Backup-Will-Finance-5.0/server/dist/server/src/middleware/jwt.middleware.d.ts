import { Request, Response, NextFunction } from 'express';
import { User } from '../types/user.types';
declare module 'express' {
    interface Request {
        user?: User;
    }
}
export declare function jwtMiddleware(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
