/**
 * Serviço de usuários (CRUD, perfil, permissões)
 */
export class UserService {
  static async getProfile(userId: string): Promise<{ id: string; name: string }> {
    // TODO: Buscar perfil real do usuário
    return { id: userId, name: 'Demo User' };
  }
}
