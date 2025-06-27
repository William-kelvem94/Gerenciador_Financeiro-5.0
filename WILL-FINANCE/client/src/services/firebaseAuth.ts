import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
  UserCredential,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { useAuthStore } from '../store/authStore'

class FirebaseAuthService {
  private readonly googleProvider: GoogleAuthProvider

  constructor() {
    this.googleProvider = new GoogleAuthProvider()
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    })

    // Adicionar escopos necessários
    this.googleProvider.addScope('email')
    this.googleProvider.addScope('profile')

    // Monitor auth state changes
    this.initAuthStateListener()
  }

  private initAuthStateListener() {
    onAuthStateChanged(auth, (firebaseUser) => {
      const authStore = useAuthStore.getState()
      
      if (firebaseUser) {
        // User is signed in
        const user = {
          id: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          username: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? '',
          firstName: firebaseUser.displayName?.split(' ')[0] ?? 'Usuário',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') ?? '',
          avatar: firebaseUser.photoURL ?? undefined,
          emailVerified: firebaseUser.emailVerified
        }

        // Get Firebase token for API authentication
        firebaseUser.getIdToken().then((token) => {
          authStore.login(user, token, token)
        })
      } else {
        // User is signed out
        authStore.logout()
      }
    })
  }

  // Email/Password Authentication
  async signUpWithEmailAndPassword(email: string, password: string, displayName?: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update display name if provided
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName })
      }

      // Send email verification
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user)
      }

      return userCredential
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code))
    }
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code))
    }
  }

  // Google Authentication
  async signInWithGoogle(): Promise<UserCredential> {
    try {
      console.log('🔥 Iniciando login com Google...')
      console.log('🔥 Provider configurado:', this.googleProvider)
      console.log('🔥 Auth instance:', auth)
      
      const result = await signInWithPopup(auth, this.googleProvider)
      console.log('🔥 Login com Google bem-sucedido:', result.user?.email)
      
      return result
    } catch (error: any) {
      console.error('🔥 Erro no login com Google:', error)
      console.error('🔥 Código do erro:', error.code)
      console.error('🔥 Mensagem do erro:', error.message)
      
      // Se popup foi bloqueado ou falhou, tentar redirect
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        console.log('🔥 Tentando login com redirect...')
        try {
          await signInWithRedirect(auth, this.googleProvider)
          // O redirect não retorna resultado imediato
          throw new Error('Redirecionando para Google...')
        } catch (redirectError: any) {
          console.error('🔥 Erro no redirect:', redirectError)
          throw new Error(this.getErrorMessage(redirectError.code))
        }
      }
      
      throw new Error(this.getErrorMessage(error.code))
    }
  }

  // Password Reset
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code))
    }
  }

  // Sign Out
  async signOut(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code))
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser
  }

  // Get current user token
  async getCurrentUserToken(): Promise<string | null> {
    const user = this.getCurrentUser()
    if (user) {
      return await user.getIdToken()
    }
    return null
  }

  // Update user profile
  async updateUserProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    const user = this.getCurrentUser()
    if (user) {
      await updateProfile(user, updates)
    } else {
      throw new Error('Usuário não autenticado')
    }
  }

  // Send email verification
  async sendEmailVerification(): Promise<void> {
    const user = this.getCurrentUser()
    if (user) {
      await sendEmailVerification(user)
    } else {
      throw new Error('Usuário não autenticado')
    }
  }

  // Error message handler
  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/email-already-in-use': 'Este email já está em uso',
      'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres',
      'auth/invalid-email': 'Email inválido',
      'auth/user-disabled': 'Esta conta foi desabilitada',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
      'auth/popup-closed-by-user': 'Login cancelado pelo usuário',
      'auth/cancelled-popup-request': 'Popup cancelado',
      'auth/popup-blocked': 'Popup bloqueado pelo navegador'
    }

    return errorMessages[errorCode] || 'Erro de autenticação. Tente novamente.'
  }
}

export const firebaseAuthService = new FirebaseAuthService()
