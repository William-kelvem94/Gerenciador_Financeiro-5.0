import { Injectable, Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export interface FirebaseUser {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
  emailVerified: boolean;
  customClaims?: Record<string, unknown>;
}

export interface TokenValidationResult {
  isValid: boolean;
  user?: FirebaseUser;
  error?: string;
}

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private app: admin.app.App | null = null;
  private auth: admin.auth.Auth | null = null;
  private firestore: admin.firestore.Firestore | null = null;
  private storage: admin.storage.Storage | null = null;
  private isInitialized = false;
  private readonly isDevelopment: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isDevelopment = this.configService.get('NODE_ENV') !== 'production';
  }

  async onModuleInit() {
    await this.initializeFirebase();
  }

  private async initializeFirebase(): Promise<void> {
    try {
      if (this.isInitialized) {
        this.logger.warn('Firebase already initialized');
        return;
      }

      // Check if Firebase Admin is already initialized
      if (admin.apps.length > 0) {
        this.app = admin.apps[0] as admin.app.App;
        this.auth = this.app.auth();
        this.firestore = this.app.firestore();
        this.storage = this.app.storage();
        this.isInitialized = true;
        this.logger.log('🔥 Using existing Firebase Admin app');
        return;
      }

      if (this.isDevelopment) {
        await this.initializeDevelopmentMode();
      } else {
        await this.initializeProductionMode();
      }

      if (this.app) {
        this.auth = this.app.auth();
        this.firestore = this.app.firestore();
        this.storage = this.app.storage();
      }

      this.isInitialized = true;
      this.logger.log('🔥 Firebase initialized successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('❌ Firebase initialization failed:', errorMessage);
      
      if (this.isDevelopment) {
        this.logger.warn('🔧 Falling back to mock mode for development');
        await this.initializeMockMode();
      } else {
        throw error;
      }
    }
  }

  private async initializeDevelopmentMode(): Promise<void> {
    this.logger.log('🔧 Initializing Firebase in development mode');
    
    try {
      // Try to initialize with minimal configuration for development
      this.app = admin.initializeApp({
        projectId: 'gerenciador-financeiro-707c4',
        // Use application default credentials or minimal config
      }, 'development-' + Date.now());

      this.logger.log('✅ Firebase development mode initialized');
    } catch (error: unknown) {
      this.logger.warn('⚠️ Firebase development initialization failed, using mock mode');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Development Firebase error:', errorMessage);
      await this.initializeMockMode();
    }
  }

  private async initializeProductionMode(): Promise<void> {
    this.logger.log('🚀 Initializing Firebase in production mode');
    
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    const databaseURL = this.configService.get<string>('FIREBASE_DATABASE_URL');
    const storageBucket = this.configService.get<string>('FIREBASE_STORAGE_BUCKET');

    if (!projectId || !privateKey || !clientEmail) {
      throw new Error('Missing required Firebase production configuration');
    }

    const serviceAccount = {
      projectId,
      privateKey,
      clientEmail,
    };

    this.app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
      databaseURL,
      storageBucket,
    }, 'production-' + Date.now());

    this.logger.log('✅ Firebase production mode initialized');
  }

  private async initializeMockMode(): Promise<void> {
    this.logger.warn('🎭 Initializing Firebase mock mode');
    
    // Mock implementation for development fallback
    this.app = null;
    this.auth = null;
    this.firestore = null;
    this.storage = null;
    this.isInitialized = true;
    
    this.logger.warn('⚠️ Firebase running in mock mode - authentication will use fallback methods');
  }

  async verifyIdToken(idToken: string): Promise<TokenValidationResult> {
    try {
      if (!this.isInitialized) {
        await this.initializeFirebase();
      }

      if (!this.auth || this.isDevelopment) {
        return this.mockVerifyToken(idToken);
      }

      const decodedToken = await this.auth.verifyIdToken(idToken);
      
      const user: FirebaseUser = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        name: decodedToken.name,
        picture: decodedToken.picture,
        emailVerified: decodedToken.email_verified || false,
        customClaims: decodedToken,
      };

      this.logger.log(`✅ Token verified for user: ${user.email}`);

      return {
        isValid: true,
        user,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('❌ Token verification failed:', errorMessage);
      
      if (this.isDevelopment) {
        // In development, try mock verification as fallback
        return this.mockVerifyToken(idToken);
      }
      
      return {
        isValid: false,
        error: errorMessage,
      };
    }
  }

  private mockVerifyToken(idToken: string): TokenValidationResult {
    this.logger.warn('🎭 Using mock token verification');
    
    // Validação mock para desenvolvimento
    if (!idToken || idToken === 'invalid') {
      return {
        isValid: false,
        error: 'Invalid token provided',
      };
    }

    // Token mock válido para desenvolvimento
    const mockUser: FirebaseUser = {
      uid: 'mock-uid-' + Date.now(),
      email: 'mock@willfinance.com',
      name: 'Mock Development User',
      picture: 'https://via.placeholder.com/150',
      emailVerified: true,
      customClaims: {
        provider: 'mock',
        aud: 'mock-audience',
        iss: 'mock-issuer',
        development: true,
      },
    };

    this.logger.log('🎭 Mock token verification successful');

    return {
      isValid: true,
      user: mockUser,
    };
  }

  async getUserByEmail(email: string): Promise<FirebaseUser | null> {
    try {
      if (!this.auth || this.isDevelopment) {
        this.logger.warn('🎭 Using mock user lookup');
        return {
          uid: 'mock-uid-' + email.replace('@', '-').replace('.', '-'),
          email,
          name: `Mock User (${email})`,
          emailVerified: true,
        };
      }

      const userRecord = await this.auth.getUserByEmail(email);
      
      return {
        uid: userRecord.uid,
        email: userRecord.email || '',
        name: userRecord.displayName,
        picture: userRecord.photoURL,
        emailVerified: userRecord.emailVerified,
        customClaims: userRecord.customClaims,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`❌ Failed to get user by email ${email}:`, errorMessage);
      
      if (this.isDevelopment) {
        // Return mock user in development
        return {
          uid: 'mock-uid-' + email.replace('@', '-').replace('.', '-'),
          email,
          name: `Mock User (${email})`,
          emailVerified: true,
        };
      }
      
      return null;
    }
  }

  async createCustomToken(uid: string, claims?: Record<string, unknown>): Promise<string | null> {
    try {
      if (!this.auth || this.isDevelopment) {
        this.logger.warn('🎭 Using mock custom token creation');
        return `mock-custom-token-${uid}-${Date.now()}`;
      }

      const customToken = await this.auth.createCustomToken(uid, claims);
      this.logger.log(`✅ Custom token created for UID: ${uid}`);
      
      return customToken;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`❌ Failed to create custom token for UID ${uid}:`, errorMessage);
      
      if (this.isDevelopment) {
        return `mock-custom-token-${uid}-${Date.now()}`;
      }
      
      return null;
    }
  }

  async setCustomUserClaims(uid: string, claims: Record<string, unknown>): Promise<boolean> {
    try {
      if (!this.auth || this.isDevelopment) {
        this.logger.warn('🎭 Mock custom claims setting');
        return true;
      }

      await this.auth.setCustomUserClaims(uid, claims);
      this.logger.log(`✅ Custom claims set for UID: ${uid}`);
      
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`❌ Failed to set custom claims for UID ${uid}:`, errorMessage);
      return this.isDevelopment; // Return true in development, false in production
    }
  }

  // Firestore operations
  async saveUserData(uid: string, data: Record<string, unknown>): Promise<boolean> {
    try {
      if (!this.firestore || this.isDevelopment) {
        this.logger.warn('🎭 Mock Firestore save operation');
        return true;
      }

      await this.firestore.collection('users').doc(uid).set(data, { merge: true });
      this.logger.log(`✅ User data saved for UID: ${uid}`);
      
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`❌ Failed to save user data for UID ${uid}:`, errorMessage);
      return this.isDevelopment; // Return true in development, false in production
    }
  }

  async getUserData(uid: string): Promise<Record<string, unknown> | null> {
    try {
      if (!this.firestore || this.isDevelopment) {
        this.logger.warn('🎭 Mock Firestore get operation');
        return {
          uid,
          lastLogin: new Date().toISOString(),
          preferences: {},
          developmentMode: true,
        };
      }

      const doc = await this.firestore.collection('users').doc(uid).get();
      
      if (!doc.exists) {
        return null;
      }

      return doc.data() as Record<string, unknown>;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`❌ Failed to get user data for UID ${uid}:`, errorMessage);
      
      if (this.isDevelopment) {
        return {
          uid,
          lastLogin: new Date().toISOString(),
          preferences: {},
          developmentMode: true,
        };
      }
      
      return null;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; services: Record<string, boolean>; mode: string }> {
    const services = {
      auth: !!this.auth || this.isDevelopment,
      firestore: !!this.firestore || this.isDevelopment,
      storage: !!this.storage || this.isDevelopment,
      initialized: this.isInitialized,
    };

    const allHealthy = Object.values(services).every(status => status);

    return {
      status: allHealthy ? 'healthy' : 'degraded',
      services,
      mode: this.isDevelopment ? 'development' : 'production',
    };
  }

  // Utilities
  get isReady(): boolean {
    return this.isInitialized;
  }

  get developmentMode(): boolean {
    return this.isDevelopment;
  }

  // Legacy compatibility method
  async verifyToken(idToken: string): Promise<FirebaseUser> {
    const result = await this.verifyIdToken(idToken);
    
    if (!result.isValid || !result.user) {
      throw new UnauthorizedException(result.error || 'Invalid Firebase token');
    }
    
    return result.user;
  }
}
