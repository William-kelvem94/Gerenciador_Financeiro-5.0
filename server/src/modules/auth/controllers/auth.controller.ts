import { Request, Response } from 'express';
import { ResponseHelper } from '../../../shared/utils/response.util';

/**
 * Controller de autenticação (login, registro, social login, etc)
 */
export class AuthController {
  static async login(req: Request, res: Response) {
    // TODO: Implementar autenticação
    return res.json(ResponseHelper.success({ token: 'fake-token' }, 'Login realizado'));
  }

  static async register(req: Request, res: Response) {
    // TODO: Implementar registro
    return res.json(ResponseHelper.success({ userId: 'fake-id' }, 'Registro realizado'));
  }
}
