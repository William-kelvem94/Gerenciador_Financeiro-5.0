import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard, GoogleAuthGuard } from './guards/auth.guards';
import { Request, Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('google')
  @ApiOperation({ summary: 'Google OAuth login with Firebase token' })
  async googleLogin(@Body() body: { firebaseToken: string; email: string; name: string; avatar?: string }) {
    return this.authService.googleLogin(body);
  }

  @Post('firebase-sync')
  @ApiOperation({ summary: 'Sync Firebase user with backend' })
  async firebaseSync(@Body() body: { firebaseToken: string; email: string; name: string; avatar?: string }) {
    return this.authService.firebaseSync(body);
  }

  @Get('google/oauth')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth login (legacy)' })
  async googleAuth() {
    // This route initiates Google OAuth
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const result = await this.authService.googleLoginLegacy(req);
    
    // Redirect to frontend with token
    const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${result.token}`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  async getProfile(@Req() req: Request & { user: { userId: string; email: string } }) {
    return req.user;
  }
}