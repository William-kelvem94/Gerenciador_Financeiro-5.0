import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Página de callback do Google OAuth
 * Processa o código de autorização e envia para a janela pai
 */
export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');

        console.log('🔥 Google Callback recebido:', { code, error, state });

        if (error) {
          // Erro no OAuth
          window.opener?.postMessage(
            {
              type: 'GOOGLE_OAUTH_ERROR',
              error:
                error === 'access_denied' ? 'Acesso negado pelo usuário' : 'Erro na autenticação',
            },
            window.location.origin
          );

          window.close();
          return;
        }

        if (!code) {
          throw new Error('Código de autorização não encontrado');
        }

        // Trocar código por informações do usuário
        const response = await fetch('/api/auth/google/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            state,
            redirectUri: `${window.location.origin}/auth/google/callback`,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message ?? 'Erro ao processar callback');
        }

        const userData = await response.json();

        console.log('🔥 Usuário autenticado:', userData);

        // Enviar sucesso para janela pai
        window.opener?.postMessage(
          {
            type: 'GOOGLE_OAUTH_SUCCESS',
            user: userData.user,
            tokens: userData.tokens,
          },
          window.location.origin
        );

        // Fechar popup
        window.close();
      } catch (error) {
        console.error('🔥 Erro no callback:', error);

        window.opener?.postMessage(
          {
            type: 'GOOGLE_OAUTH_ERROR',
            error: error instanceof Error ? error.message : 'Erro desconhecido',
          },
          window.location.origin
        );

        window.close();
      }
    };

    processCallback();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-400"></div>
        <h2 className="mb-2 text-xl font-semibold text-white">Processando autenticação...</h2>
        <p className="text-gray-400">Aguarde enquanto validamos suas credenciais</p>
      </div>
    </div>
  );
}
