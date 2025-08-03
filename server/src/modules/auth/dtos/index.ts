/**
 * 📋 DTOs de Autenticação - Will Finance 5.0
 * 
 * Data Transfer Objects para validação de entrada e saída
 */

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'auto';
    language?: 'pt-BR' | 'en-US';
    currency?: 'BRL' | 'USD' | 'EUR';
    notifications?: {
      email?: boolean;
      push?: boolean;
      budget?: boolean;
      transactions?: boolean;
    };
  };
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface VerifyEmailDto {
  token: string;
}

export interface ResendVerificationDto {
  email: string;
}

// Response DTOs
export interface AuthResponseDto {
  user: UserResponseDto;
  tokens: TokensDto;
}

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  preferences: UserPreferencesDto;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferencesDto {
  theme: 'light' | 'dark' | 'auto';
  language: 'pt-BR' | 'en-US';
  currency: 'BRL' | 'USD' | 'EUR';
  notifications: {
    email: boolean;
    push: boolean;
    budget: boolean;
    transactions: boolean;
  };
}

export interface TokensDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface GoogleUserDto {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email: boolean;
}
