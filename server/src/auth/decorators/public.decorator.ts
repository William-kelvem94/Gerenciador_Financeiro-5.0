/**
 * Decorator para marcar rotas como públicas (não requerem autenticação)
 * Para uso com Express.js
 */

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator para marcar uma rota como pública
 * Uso: adicionar esta propriedade à função de rota
 */
export const Public = () => ({ [IS_PUBLIC_KEY]: true });

/**
 * Função para verificar se uma rota é pública
 */
export const isPublicRoute = (routeHandler: any): boolean => {
  return routeHandler?.[IS_PUBLIC_KEY] === true;
};
