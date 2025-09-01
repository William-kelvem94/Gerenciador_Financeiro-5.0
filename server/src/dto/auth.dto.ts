// auth.dto.ts - DTOs para autenticação (Enterprise Level)
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createdAt: string;
  };
  token: string;
  refreshToken?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
