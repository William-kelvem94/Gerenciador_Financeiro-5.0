import admin from 'firebase-admin'
import { logger } from '../utils/logger'

// Initialize Firebase Admin SDK
export const initializeFirebaseAdmin = () => {
  try {
    // Check if Firebase Admin is already initialized
    if (admin.apps.length > 0) {
      logger.info('Firebase Admin already initialized')
      return admin.app()
    }

    const serviceAccount = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID ?? 'gerenciador-financeiro-707c4',
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL ?? 'firebase-adminsdk-fbsvc@gerenciador-financeiro-707c4.iam.gserviceaccount.com',
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n') ?? ''
    }

    // For development, you can use a service account key file
    if (process.env.NODE_ENV === 'development' && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
      })
    } else if (serviceAccount.privateKey) {
      // Use environment variables
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      })
    } else {
      // Fallback: use default credentials (works in Google Cloud environments)
      admin.initializeApp()
    }

    logger.info('✅ Firebase Admin initialized successfully')
    return admin.app()
  } catch (error) {
    logger.error('❌ Firebase Admin initialization failed:', error)
    // Don't throw error - allow app to continue with local auth
    return null
  }
}

// Verify Firebase ID token
export const verifyFirebaseToken = async (idToken: string) => {
  try {
    if (!admin.apps.length) {
      throw new Error('Firebase Admin not initialized')
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken)
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      emailVerified: decodedToken.email_verified
    }
  } catch (error) {
    logger.error('Firebase token verification failed:', error)
    throw new Error('Token inválido')
  }
}

// Get user by UID
export const getFirebaseUser = async (uid: string) => {
  try {
    if (!admin.apps.length) {
      throw new Error('Firebase Admin not initialized')
    }

    const userRecord = await admin.auth().getUser(uid)
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName,
      picture: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      disabled: userRecord.disabled,
      createdAt: userRecord.metadata.creationTime,
      lastSignIn: userRecord.metadata.lastSignInTime
    }
  } catch (error) {
    logger.error('Failed to get Firebase user:', error)
    throw new Error('Usuário não encontrado')
  }
}

// Create custom token
export const createCustomToken = async (uid: string, additionalClaims?: any) => {
  try {
    if (!admin.apps.length) {
      throw new Error('Firebase Admin not initialized')
    }

    const customToken = await admin.auth().createCustomToken(uid, additionalClaims)
    return customToken
  } catch (error) {
    logger.error('Failed to create custom token:', error)
    throw new Error('Erro ao criar token personalizado')
  }
}

export default admin
