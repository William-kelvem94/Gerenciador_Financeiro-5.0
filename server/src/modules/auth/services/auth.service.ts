import { LoginData } from '../dto/login.dto';
import { RegisterData } from '../dto/register.dto';

/**
 * Serviço de autenticação (login, registro, social login)
 */
export class AuthService {
  static async login(data: LoginData): Promise<{ token: string }> {
    // TODO: Implementar autenticação real
    return { token: 'fake-token' };
  }

  static async register(data: RegisterData): Promise<{ userId: string }> {
    // TODO: Implementar registro real
    return { userId: 'fake-id' };
  }
}
