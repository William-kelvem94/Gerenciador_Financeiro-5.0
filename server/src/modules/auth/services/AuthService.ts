/**
 * 🔐 Serviço de Autenticação - Will Finance 5.0
 * 
 * Gerencia toda lógica de autenticação, registro e verificação
 */

import bcrypt from 'bcryptjs';
import { UserService } from './UserService';
import { TokenService } from './TokenService';
import { EmailService } from '../../../shared/services/EmailService';
import { 
  RegisterDto, 
  LoginDto, 
  AuthResponseDto, 
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  ResendVerificationDto,
  TokensDto
} from '../dtos';
import { AppError } from '../../../shared/errors/AppError';
import { HTTP_STATUS } from '../../../shared/constants/httpStatus';
import { logger } from '../../../utils/logger';
import { generateRandomToken } from '../../../utils/crypto';

export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService = new EmailService()
  ) {
    // Ensure services are properly initialized
    this.userService = userService;
    this.tokenService = tokenService;
    this.emailService = emailService;
  }

  /**
   * 📝 Registrar novo usuário
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { name, email, password, confirmPassword, acceptTerms } = registerDto;

    // Validações
    if (password !== confirmPassword) {
      throw new AppError('Senhas não coincidem', HTTP_STATUS.BAD_REQUEST);
    }

    if (!acceptTerms) {
      throw new AppError('É necessário aceitar os termos de uso', HTTP_STATUS.BAD_REQUEST);
    }

    // Verificar se usuário já existe
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email já está em uso', HTTP_STATUS.CONFLICT);
    }

    // Hash da senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Gerar token de verificação de email
    const emailVerificationToken = generateRandomToken();

    // Criar usuário
    const user = await this.userService.create({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken,
    });

    // Gerar tokens JWT
    const tokens = await this.tokenService.generateTokens(user.id, user.email);

    // Enviar email de verificação
    await this.emailService.sendVerificationEmail(email, name, emailVerificationToken);

    logger.info(`Usuário registrado: ${email}`);

    return {
      user: this.userService.sanitizeUser(user),
      tokens
    };
  }

  /**
   * 🔑 Login de usuário
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Buscar usuário com senha
    const user = await this.userService.findByEmailWithPassword(email);
    if (!user) {
      throw new AppError('Credenciais inválidas', HTTP_STATUS.UNAUTHORIZED);
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas', HTTP_STATUS.UNAUTHORIZED);
    }

    // Verificar se conta está ativa
    if (!user.isActive) {
      throw new AppError('Conta desativada. Entre em contato com o suporte.', HTTP_STATUS.FORBIDDEN);
    }

    // Atualizar último login
    await this.userService.updateLastLogin(user.id);

    // Gerar tokens JWT
    const tokens = await this.tokenService.generateTokens(user.id, user.email);

    logger.info(`Login realizado: ${email}`);

    return {
      user: this.userService.sanitizeUser(user),
      tokens
    };
  }

  /**
   * 🔄 Renovar tokens
   */
  async refreshToken(refreshToken: string): Promise<TokensDto> {
    try {
      const decoded = await this.tokenService.verifyRefreshToken(refreshToken);
      
      // Verificar se usuário ainda existe e está ativo
      const user = await this.userService.findById(decoded.sub);
      if (!user || !user.isActive) {
        throw new AppError('Token inválido', HTTP_STATUS.UNAUTHORIZED);
      }

      // Gerar novos tokens
      const tokens = await this.tokenService.generateTokens(user.id, user.email);

      return tokens;
    } catch (error) {
      logger.error('Erro ao renovar token:', error);
      throw new AppError('Token de refresh inválido', HTTP_STATUS.UNAUTHORIZED);
    }
  }

  /**
   * 🚪 Logout
   */
  async logout(userId: string): Promise<void> {
    // Invalidar todos os refresh tokens do usuário
    await this.tokenService.revokeAllTokens(userId);
    
    logger.info(`Logout realizado para usuário: ${userId}`);
  }

  /**
   * 🔐 Alterar senha
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword, confirmNewPassword } = changePasswordDto;

    if (newPassword !== confirmNewPassword) {
      throw new AppError('Nova senha e confirmação não coincidem', HTTP_STATUS.BAD_REQUEST);
    }

    // Buscar usuário com senha atual
    const user = await this.userService.findByIdWithPassword(userId);
    if (!user) {
      throw new AppError('Usuário não encontrado', HTTP_STATUS.NOT_FOUND);
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new AppError('Senha atual incorreta', HTTP_STATUS.BAD_REQUEST);
    }

    // Hash da nova senha
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Atualizar senha
    await this.userService.updatePassword(userId, hashedNewPassword);

    // Invalidar todos os tokens
    await this.tokenService.revokeAllTokens(userId);

    logger.info(`Senha alterada para usuário: ${userId}`);
  }

  /**
   * 📧 Solicitar recuperação de senha
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      // Por segurança, não revelar que o email não existe
      logger.info(`Tentativa de recuperação para email inexistente: ${email}`);
      return;
    }

    // Gerar token de recuperação
    const resetToken = generateRandomToken();
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token de recuperação
    await this.userService.setPasswordResetToken(user.id, resetToken, resetTokenExpires);

    // Enviar email de recuperação
    await this.emailService.sendPasswordResetEmail(email, user.name, resetToken);

    logger.info(`Recuperação de senha solicitada para: ${email}`);
  }

  /**
   * 🔑 Redefinir senha
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, newPassword, confirmNewPassword } = resetPasswordDto;

    if (newPassword !== confirmNewPassword) {
      throw new AppError('Nova senha e confirmação não coincidem', HTTP_STATUS.BAD_REQUEST);
    }

    // Buscar usuário pelo token de reset
    const user = await this.userService.findByPasswordResetToken(token);
    if (!user) {
      throw new AppError('Token de recuperação inválido ou expirado', HTTP_STATUS.BAD_REQUEST);
    }

    // Hash da nova senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Atualizar senha e limpar token de reset
    await this.userService.resetPassword(user.id, hashedPassword);

    // Invalidar todos os tokens
    await this.tokenService.revokeAllTokens(user.id);

    logger.info(`Senha redefinida para usuário: ${user.id}`);
  }

  /**
   * ✅ Verificar email
   */
  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<void> {
    const { token } = verifyEmailDto;

    const user = await this.userService.findByEmailVerificationToken(token);
    if (!user) {
      throw new AppError('Token de verificação inválido ou expirado', HTTP_STATUS.BAD_REQUEST);
    }

    // Marcar email como verificado
    await this.userService.verifyEmail(user.id);

    logger.info(`Email verificado para usuário: ${user.id}`);
  }

  /**
   * 📤 Reenviar verificação de email
   */
  async resendVerification(resendVerificationDto: ResendVerificationDto): Promise<void> {
    const { email } = resendVerificationDto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      // Por segurança, não revelar que o email não existe
      logger.info(`Tentativa de reenvio para email inexistente: ${email}`);
      return;
    }

    if (user.emailVerified) {
      throw new AppError('Email já está verificado', HTTP_STATUS.BAD_REQUEST);
    }

    // Gerar novo token de verificação
    const emailVerificationToken = generateRandomToken();
    await this.userService.updateEmailVerificationToken(user.id, emailVerificationToken);

    // Enviar email de verificação
    await this.emailService.sendVerificationEmail(email, user.name, emailVerificationToken);

    logger.info(`Verificação reenviada para: ${email}`);
  }
}
