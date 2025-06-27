// Google OAuth Configuration
// Este arquivo configura o Google OAuth tanto para Firebase quanto para OAuth direto

export interface GoogleOAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string[];
  responseType: string;
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export class GoogleOAuthService {
  private config: GoogleOAuthConfig;
  private popup: Window | null = null;

  constructor() {
    this.config = {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '845096565411-demo.apps.googleusercontent.com',
      redirectUri: `${window.location.origin}/auth/google/callback`,
      scope: [
        'openid',
        'email',
        'profile'
      ],
      responseType: 'code'
    };
  }

  /**
   * Inicia o processo de login com Google OAuth
   */
  async signIn(): Promise<GoogleUser> {
    return new Promise((resolve, reject) => {
      try {
        // URL do Google OAuth
        const authUrl = this.buildAuthUrl();
        
        console.log('🔥 Iniciando Google OAuth...', authUrl);
        
        // Abrir popup
        this.popup = window.open(
          authUrl,
          'google-oauth',
          'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        if (!this.popup) {
          throw new Error('Popup foi bloqueado pelo navegador');
        }

        // Escutar mensagens do popup
        const messageListener = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) {
            return;
          }

          if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
            window.removeEventListener('message', messageListener);
            this.popup?.close();
            resolve(event.data.user);
          } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
            window.removeEventListener('message', messageListener);
            this.popup?.close();
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener('message', messageListener);

        // Verificar se popup foi fechado manualmente
        const checkClosed = setInterval(() => {
          if (this.popup?.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            reject(new Error('Login cancelado pelo usuário'));
          }
        }, 1000);

      } catch (error) {
        console.error('🔥 Erro no Google OAuth:', error);
        reject(error);
      }
    });
  }

  /**
   * Constrói a URL de autorização do Google
   */
  private buildAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope.join(' '),
      response_type: this.config.responseType,
      access_type: 'offline',
      prompt: 'consent',
      state: this.generateState()
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Gera um estado aleatório para segurança
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Processa o código de autorização do Google
   */
  async exchangeCodeForToken(code: string): Promise<GoogleUser> {
    try {
      console.log('🔥 Trocando código por token...', code);

      // Trocar código por token
      const tokenResponse = await fetch('/api/auth/google/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });

      if (!tokenResponse.ok) {
        throw new Error('Falha ao trocar código por token');
      }

      const tokenData = await tokenResponse.json();
      
      // Buscar informações do usuário
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Falha ao obter informações do usuário');
      }

      const userData = await userResponse.json();
      
      console.log('🔥 Usuário Google obtido:', userData);
      
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        given_name: userData.given_name,
        family_name: userData.family_name
      };

    } catch (error) {
      console.error('🔥 Erro ao processar token:', error);
      throw error;
    }
  }
}

export const googleOAuthService = new GoogleOAuthService();
