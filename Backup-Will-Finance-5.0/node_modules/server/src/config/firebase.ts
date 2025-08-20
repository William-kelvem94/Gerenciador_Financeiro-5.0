import admin from 'firebase-admin';

/**
 * Inicializa o Firebase Admin SDK para autenticação e serviços.
 * Garante inicialização única em ambiente enterprise.
 * Não sobrescreve configs existentes.
 */
export function initializeFirebaseAdmin(): void {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      // databaseURL: process.env.FIREBASE_DATABASE_URL,
      // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      // Outras configs customizadas podem ser mantidas aqui
    });
  }
}

export { admin };
