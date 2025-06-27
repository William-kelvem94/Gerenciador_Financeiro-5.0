import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from './auth.entity';
import { CreateUserDto, LoginDto, UpdateUserDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ user: User; token: string }> {
    // Verificar se o usuário já existe
    const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Criar usuário
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      preferences: {
        theme: 'system',
        currency: 'BRL',
        language: 'pt',
        notifications: {
          budget: true,
          goals: true,
          transactions: true,
        },
      },
    });

    const savedUser = await this.userRepository.save(user);

    // Gerar token JWT
    const token = this.generateToken(savedUser);

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = savedUser;

    return { user: userWithoutPassword as User, token };
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    // Buscar usuário
    const user = await this.userRepository.findOneBy({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gerar token JWT
    const token = this.generateToken(user);

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword as User, token };
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Verificar se email já está em uso por outro usuário
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOneBy({ email: updateUserDto.email });
      if (existingUser) {
        throw new ConflictException('Email já está em uso');
      }
    }

    // Atualizar usuário
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async getUserProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
