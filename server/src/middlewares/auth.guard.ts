import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/services/prisma.service';
import { Request } from 'express';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
}

interface AuthenticatedUser {
  userId: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, name: true },
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      request.user = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: payload.role,
        permissions: payload.permissions,
      };
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(
    request: AuthenticatedRequest,
  ): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader || typeof authHeader !== 'string') {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
