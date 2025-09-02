import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/services/prisma.service';
import { CreateAccountDto } from '@/dto/create-account.dto';
import { UpdateAccountDto } from '@/dto/update-account.dto';
import { Account } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    return this.prisma.account.create({
      data: {
        ...createAccountDto,
        userId,
      },
    });
  }

  async findAllByUser(userId: string): Promise<Account[]> {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Account | null> {
    return this.prisma.account.findFirst({
      where: { id, userId },
    });
  }

  async update(
    id: string,
    updateData: UpdateAccountDto,
  ): Promise<Account> {
    return this.prisma.account.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<Account> {
    return this.prisma.account.delete({
      where: { id },
    });
  }
}
