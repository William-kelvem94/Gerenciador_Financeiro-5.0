import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyDR7Vno5WxbE-XRk4fvUgj7A0JlvW2tgxc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "gerenciador-financeiro-707c4.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "gerenciador-financeiro-707c4",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "gerenciador-financeiro-707c4.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "845096565411",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:845096565411:web:0ad3e8e8d2c5d9e2f5a8b4"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Connect to emulators in development
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099')
    connectFirestoreEmulator(db, 'localhost', 8080)
    console.log('🔥 Connected to Firebase emulators')
  } catch (error) {
    // Firebase emulators already connected or not available - safe to ignore
    console.warn('Firebase emulators already connected or not available', error)
  }
}

export default app
