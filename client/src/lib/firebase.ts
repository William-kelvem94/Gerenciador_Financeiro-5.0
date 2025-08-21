import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // @ts-ignore
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY,
  // @ts-ignore
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN,
  // @ts-ignore
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID,
  // @ts-ignore
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET,
  // @ts-ignore
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  // @ts-ignore
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
