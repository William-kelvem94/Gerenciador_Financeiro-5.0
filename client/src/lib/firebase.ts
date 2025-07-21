// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDR7Vno5WxbE-XRk4fvUgj7A0JlvW2tgxc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gerenciador-financeiro-707c4.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gerenciador-financeiro-707c4",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gerenciador-financeiro-707c4.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "845096565411",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:845096565411:web:0ad3e8e8d2c5d9e2f5a8b4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Connect to emulators in development
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  const authHost = import.meta.env.VITE_FIREBASE_EMULATOR_HOST || 'localhost';
  const authPort = import.meta.env.VITE_FIREBASE_EMULATOR_AUTH_PORT || '9099';
  const firestorePort = import.meta.env.VITE_FIREBASE_EMULATOR_FIRESTORE_PORT || '8080';
  
  connectAuthEmulator(auth, `http://${authHost}:${authPort}`);
  connectFirestoreEmulator(db, authHost, parseInt(firestorePort));
}

export default app;
