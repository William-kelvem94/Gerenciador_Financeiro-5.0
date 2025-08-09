import { Request, Response } from 'express';
import { ResponseHelper } from '../../../shared/utils/response.util';

/**
 * Controller de usuários (CRUD, perfil, permissões)
 */
export class UserController {
  static async getProfile(req: Request, res: Response) {
    // TODO: Buscar perfil do usuário
    return res.json(ResponseHelper.success({ id: 'fake-user', name: 'Demo User' }, 'Perfil carregado'));
  }
}
