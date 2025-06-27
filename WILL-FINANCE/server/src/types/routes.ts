import { Request, Response } from 'express'

// Tipos estendidos para as rotas
export interface AuthenticatedRequest extends Request {
  userId?: string
  user?: {
    id: string
    email: string
    username: string
    firstName: string
    lastName: string
  }
}

export type RouteHandler = (req: AuthenticatedRequest, res: Response) => Promise<void>
export type PublicRouteHandler = (req: Request, res: Response) => Promise<void>

// Wrapper para handlers de rota com tipagem correta
export const createHandler = (handler: RouteHandler) => {
  return async (req: Request, res: Response) => {
    await handler(req as AuthenticatedRequest, res)
  }
}

export const createPublicHandler = (handler: PublicRouteHandler) => {
  return async (req: Request, res: Response) => {
    await handler(req, res)
  }
}
