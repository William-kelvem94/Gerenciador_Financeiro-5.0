import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export interface FirebaseConfig {
  projectId: string;
  privateKey: string;
  clientEmail: string;
  databaseURL: string;
  storageBucket: string;
}

@Injectable()
export class FirebaseConfigService {
  private readonly logger = new Logger(FirebaseConfigService.name);
  private readonly _config: FirebaseConfig;
  private readonly _isDevelopment: boolean;

  constructor(private readonly configService: ConfigService) {
    this._isDevelopment = this.configService.get('NODE_ENV') !== 'production';
    this._config = this.loadConfig();
  }

  private loadConfig(): FirebaseConfig {
    if (this._isDevelopment) {
      // Configuração completa para desenvolvimento
      return {
        projectId: 'gerenciador-financeiro-707c4',
        privateKey: this.generateMockPrivateKey(),
        clientEmail: 'firebase-adminsdk-dev@gerenciador-financeiro-707c4.iam.gserviceaccount.com',
        databaseURL: 'https://gerenciador-financeiro-707c4-default-rtdb.firebaseio.com',
        storageBucket: 'gerenciador-financeiro-707c4.appspot.com'
      };
    }

    // Configuração para produção
    return {
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID') || 'default-project',
      privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n') || '',
      clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL') || 'default@example.com',
      databaseURL: this.configService.get<string>('FIREBASE_DATABASE_URL') || 'https://default.firebaseio.com',
      storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET') || 'default.appspot.com'
    };
  }

  private generateMockPrivateKey(): string {
    // Gera uma chave privada mock para desenvolvimento
    return `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8Q4R5Z8k7dYX3
QwJXKqPQo2KQ5ZrQYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3Q
YqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ
4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX
5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3Q
YqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ
4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQwIBA
QAAAoIBABqQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7
Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5
rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQ
KzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7
Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5
rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQ
KzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQoQKzX7Q6Y5rQECgYEA5Q3QYqGQ4oLX
5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3Q
YqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ
4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX5Q3QYqGQ4oLX
-----END PRIVATE KEY-----`;
  }

  get config(): FirebaseConfig {
    return this._config;
  }

  get isDevelopment(): boolean {
    return this._isDevelopment;
  }

  validateConfig(): boolean {
    const required = ['projectId', 'privateKey', 'clientEmail'];
    
    for (const field of required) {
      if (!this._config[field]) {
        this.logger.error(`Missing required Firebase config field: ${field}`);
        return false;
      }
    }

    return true;
  }

  getCredential(): admin.credential.Credential {
    if (this._isDevelopment) {
      // Modo desenvolvimento - usar configuração mock
      this.logger.warn('🔥 Using Firebase mock configuration for development');
      return admin.credential.cert({
        projectId: this._config.projectId,
        privateKey: this._config.privateKey,
        clientEmail: this._config.clientEmail,
      });
    }

    // Modo produção - usar configuração real
    return admin.credential.cert({
      projectId: this._config.projectId,
      privateKey: this._config.privateKey,
      clientEmail: this._config.clientEmail,
    });
  }
}
