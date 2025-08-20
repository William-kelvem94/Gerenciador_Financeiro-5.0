import type { Response, NextFunction, RequestHandler } from 'express';
export declare function asyncHandler(fn: (req: any, res: Response, next: NextFunction) => Promise<any>): RequestHandler;
