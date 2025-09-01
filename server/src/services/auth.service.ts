import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/services/prisma.service';
import { RegisterDto, LoginDto } from '@/dto/auth.dto';
import * as bcrypt from 'bcryptjs';

interface UserResponse {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  user: UserResponse;
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<AuthResponse> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const token = this.jwtService.sign({ userId: user.id });

    return {
      success: true,
      user,
      token,
    };
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.jwtService.sign({ userId: user.id });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }
}
