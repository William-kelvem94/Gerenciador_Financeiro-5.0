import { AccountDTO, AccountSchema } from '../dto/account.dto';
import { PrismaClient } from '@prisma/client';

export class AccountService {
  constructor(private prisma: PrismaClient) {}

  async create(data: AccountDTO) {
    const validated = AccountSchema.parse(data);
    return this.prisma.account.create({ data: validated });
  }

  async findAll(userId: string) {
    return this.prisma.account.findMany({ where: { userId, isActive: true } });
  }

  async findById(id: string) {
    return this.prisma.account.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<AccountDTO>) {
    return this.prisma.account.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.account.update({ where: { id }, data: { isActive: false } });
  }
}
