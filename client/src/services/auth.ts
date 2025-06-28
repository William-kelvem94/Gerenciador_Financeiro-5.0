import {
  Auth,
  User,
  UserCredential,
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseSignUp,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser
} from 'firebase/auth';
import { auth } from '../config/firebase';

export interface UpdateProfileData {
  displayName?: string;
  photoURL?: string;
}

class AuthService {
  private auth: Auth;
  private googleProvider: GoogleAuthProvider;

  constructor() {
    this.auth = auth;
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.addScope('email');
    this.googleProvider.addScope('profile');
  }

  // Observar mudanças no estado de autenticação
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(this.auth, callback);
  }

  // Entrar com email e senha
  async signInWithEmailAndPassword(email: string, password: string): Promise<User> {
    try {
      const result: UserCredential = await firebaseSignIn(this.auth, email, password);
      return result.user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Criar conta com email e senha
  async createUserWithEmailAndPassword(email: string, password: string): Promise<User> {
    try {
      const result: UserCredential = await firebaseSignUp(this.auth, email, password);
      return result.user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Entrar com Google
  async signInWithGoogle(): Promise<User> {
    try {
      const result: UserCredential = await signInWithPopup(this.auth, this.googleProvider);
      return result.user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Sair
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(this.auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Enviar email de verificação
  async sendEmailVerification(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Nenhum usuário autenticado');
    }

    try {
      await firebaseSendEmailVerification(user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Enviar email de redefinição de senha
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await firebaseSendPasswordResetEmail(this.auth, email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Atualizar perfil
  async updateProfile(profileData: UpdateProfileData): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Nenhum usuário autenticado');
    }

    try {
      await firebaseUpdateProfile(user, profileData);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Atualizar senha
  async updatePassword(newPassword: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Nenhum usuário autenticado');
    }

    try {
      await firebaseUpdatePassword(user, newPassword);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Reautenticar usuário
  async reauthenticate(currentPassword: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user || !user.email) {
      throw new Error('Nenhum usuário autenticado');
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Deletar conta
  async deleteAccount(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Nenhum usuário autenticado');
    }

    try {
      await deleteUser(user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Obter usuário atual
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Obter token de autenticação
  async getIdToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (!user) return null;

    try {
      return await user.getIdToken();
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Verificar se email está verificado
  isEmailVerified(): boolean {
    const user = this.auth.currentUser;
    return user?.emailVerified ?? false;
  }

  // Tratamento de erros de autenticação
  private handleAuthError(error: any): Error {
    let message = 'Erro de autenticação desconhecido';

    switch (error.code) {
      case 'auth/user-not-found':
        message = 'Usuário não encontrado';
        break;
      case 'auth/wrong-password':
        message = 'Senha incorreta';
        break;
      case 'auth/email-already-in-use':
        message = 'Este email já está sendo usado';
        break;
      case 'auth/weak-password':
        message = 'A senha deve ter pelo menos 6 caracteres';
        break;
      case 'auth/invalid-email':
        message = 'Email inválido';
        break;
      case 'auth/user-disabled':
        message = 'Esta conta foi desabilitada';
        break;
      case 'auth/too-many-requests':
        message = 'Muitas tentativas. Tente novamente mais tarde';
        break;
      case 'auth/network-request-failed':
        message = 'Erro de conexão. Verifique sua internet';
        break;
      case 'auth/requires-recent-login':
        message = 'Esta ação requer uma autenticação recente';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Login cancelado pelo usuário';
        break;
      case 'auth/popup-blocked':
        message = 'Popup bloqueado pelo navegador';
        break;
      default:
        message = error.message || message;
    }

    return new Error(message);
  }
}

export const authService = new AuthService();
