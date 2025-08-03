/**
 * ✅ Validações de Autenticação - Will Finance 5.0
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../../../shared/errors/AppError';
import { HTTP_STATUS } from '../../../shared/constants/httpStatus';
import { logger } from '../../../utils/logger';

// Schemas de validação usando Zod
const registerSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome não pode exceder 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  
  email: z.string()
    .email('Email inválido')
    .max(100, 'Email não pode exceder 100 caracteres'),
  
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha não pode exceder 100 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'),
  
  confirmPassword: z.string(),
  
  acceptTerms: z.boolean()
    .refine(val => val === true, 'Você deve aceitar os termos de uso')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
});

const loginSchema = z.object({
  email: z.string()
    .email('Email inválido'),
  
  password: z.string()
    .min(1, 'Senha é obrigatória'),
  
  rememberMe: z.boolean().optional()
});

const refreshTokenSchema = z.object({
  refreshToken: z.string()
    .min(1, 'Refresh token é obrigatório')
});

const updateProfileSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome não pode exceder 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços')
    .optional(),
  
  email: z.string()
    .email('Email inválido')
    .max(100, 'Email não pode exceder 100 caracteres')
    .optional(),
  
  phone: z.string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (11) 99999-9999')
    .optional(),
  
  avatar: z.string()
    .url('Avatar deve ser uma URL válida')
    .optional(),
  
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  language: z.enum(['pt-BR', 'en-US']).optional(),
  currency: z.enum(['BRL', 'USD', 'EUR']).optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional()
});

const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Senha atual é obrigatória'),
  
  newPassword: z.string()
    .min(8, 'Nova senha deve ter pelo menos 8 caracteres')
    .max(100, 'Nova senha não pode exceder 100 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Nova senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'),
  
  confirmNewPassword: z.string()
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: 'Nova senha e confirmação não coincidem',
  path: ['confirmNewPassword']
});

const forgotPasswordSchema = z.object({
  email: z.string()
    .email('Email inválido')
});

const resetPasswordSchema = z.object({
  token: z.string()
    .min(1, 'Token é obrigatório'),
  
  newPassword: z.string()
    .min(8, 'Nova senha deve ter pelo menos 8 caracteres')
    .max(100, 'Nova senha não pode exceder 100 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Nova senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'),
  
  confirmNewPassword: z.string()
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: 'Nova senha e confirmação não coincidem',
  path: ['confirmNewPassword']
});

const verifyEmailSchema = z.object({
  token: z.string()
    .min(1, 'Token é obrigatório')
});

const resendVerificationSchema = z.object({
  email: z.string()
    .email('Email inválido')
});

// Função helper para criar middlewares de validação
function createValidator(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        logger.warn('Erro de validação:', formattedErrors);

        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Dados inválidos',
          errors: formattedErrors
        });
      } else {
        logger.error('Erro na validação:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  };
}

// Middlewares de validação exportados
export const validateAuth = {
  register: createValidator(registerSchema),
  login: createValidator(loginSchema),
  refreshToken: createValidator(refreshTokenSchema),
  updateProfile: createValidator(updateProfileSchema),
  changePassword: createValidator(changePasswordSchema),
  forgotPassword: createValidator(forgotPasswordSchema),
  resetPassword: createValidator(resetPasswordSchema),
  verifyEmail: createValidator(verifyEmailSchema),
  resendVerification: createValidator(resendVerificationSchema)
};
