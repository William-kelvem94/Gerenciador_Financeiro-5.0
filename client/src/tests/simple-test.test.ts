// Teste simples para verificar se o ambiente está funcionando
import { describe, it, expect } from 'vitest';

describe('Ambiente de Testes', () => {
  it('deve executar um teste básico', () => {
    expect(1 + 1).toBe(2);
  });

  it('deve ter acesso ao objeto window', () => {
    expect(window).toBeDefined();
    expect(window.localStorage).toBeDefined();
  });

  it('deve ter acesso ao fetch', () => {
    expect(fetch).toBeDefined();
  });
});