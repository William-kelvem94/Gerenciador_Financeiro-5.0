import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService, AuthResponse } from '@/services/auth.service';
import { RegisterDto, LoginDto } from '@/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto): Promise<AuthResponse> {
    return this.authService.login(body);
  }

  @Get('profile')
  async getProfile() {
    await Promise.resolve(); // Força await para ESLint
    return { message: 'Profile endpoint' };
  }
}
