import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  name!: string;

  @MinLength(6)
  password!: string;

  @IsOptional()
  avatar?: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    currency: string;
    language: 'pt' | 'en';
    notifications: {
      budget: boolean;
      goals: boolean;
      transactions: boolean;
    };
  };
}
