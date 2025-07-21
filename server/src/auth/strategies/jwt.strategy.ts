import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'will-finance-secret-key',
    });
  }

  async validate(payload: { userId: string; [key: string]: unknown }) {
    // Add payload validation for security
    if (!payload?.userId) {
      throw new Error('Invalid JWT payload');
    }
    return this.authService.validateUser(payload.userId);
  }
}