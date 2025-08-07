import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token de acesso requerido');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true }
      });

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      req['user'] = user;
      return true;
    } catch {
      throw new ForbiddenException('Token inválido');
    }
  }
}
