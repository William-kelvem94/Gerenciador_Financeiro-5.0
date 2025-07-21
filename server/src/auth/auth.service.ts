import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from './firebase.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = this.jwtService.sign({ userId: user.id, email: user.email });

    return {
      user,
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    console.log('🔍 Login attempt:', { email, passwordLength: password?.length });

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    console.log('👤 User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('❌ User not found for email:', email);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔑 Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', email);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.jwtService.sign({ userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async googleLoginLegacy(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('No user from Google');
    }

    const { email, firstName, lastName, picture } = req.user;

    // Check if user exists
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user for Google OAuth
      user = await this.prisma.user.create({
        data: {
          email,
          name: `${firstName} ${lastName}`,
          password: '', // Google OAuth users don't have passwords
          avatar: picture ?? null,
        },
      });
    }

    // Generate JWT token
    const token = this.jwtService.sign({ userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
      },
    });
  }

  async googleLogin(data: { firebaseToken: string; email: string; name: string; avatar?: string }) {
    try {
      // For now, we'll bypass Firebase token verification in development
      // In production, uncomment the line below:
      // const decodedToken = await this.firebaseService.verifyIdToken(data.firebaseToken);
      
      // Find or create user
      let user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        // Create new user from Google data
        user = await this.prisma.user.create({
          data: {
            email: data.email,
            name: data.name,
            avatar: data.avatar,
            password: '', // No password for Google users
          },
        });
      } else {
        // Update user info from Google
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            name: data.name,
            avatar: data.avatar,
          },
        });
      }

      // Generate JWT token
      const token = this.jwtService.sign({ userId: user.id, email: user.email });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
        token,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthorizedException(`Google authentication failed: ${error.message}`);
      }
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  async firebaseSync(data: { firebaseToken: string; email: string; name: string; avatar?: string }) {
    return this.googleLogin(data); // Same logic for now
  }
}