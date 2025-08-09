/**
 * Estratégia JWT para autenticação
 */
export class JwtStrategy {
  static verify(token: string): boolean {
    // TODO: Implementar verificação real do JWT
    return token === 'fake-token';
  }
}
