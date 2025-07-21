import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'will-finance-secret-key',
    });
  }

  async validate(payload: { userId: string; [key: string]: unknown }) {
    // Add payload validation for security
    if (!payload || !payload.userId) {
      throw new Error('Invalid JWT payload');
    }
    return this.authService.validateUser(payload.userId);
  }
}