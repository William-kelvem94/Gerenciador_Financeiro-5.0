import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.account.findMany({ where: { userId } });
  }

  async create(body: any, userId: string) {
    return this.prisma.account.create({ data: { ...body, userId } });
  }
}
