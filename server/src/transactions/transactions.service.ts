import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, UpdateTransactionDto, TransactionQueryDto } from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const { amount, description, type, date, accountId, categoryId } = createTransactionDto;

    // Verify account belongs to user
    const account = await this.prisma.account.findFirst({
      where: { id: accountId, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Create transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        amount,
        description,
        type,
        date: new Date(date),
        userId,
        accountId,
        categoryId,
      },
      include: {
        account: true,
        category: true,
      },
    });

    // Update account balance
    if (type === 'income') {
      await this.prisma.account.update({
        where: { id: accountId },
        data: { balance: { increment: amount } },
      });
    } else if (type === 'expense') {
      await this.prisma.account.update({
        where: { id: accountId },
        data: { balance: { decrement: amount } },
      });
    }

    return transaction;
  }

  async findAll(userId: string, query: TransactionQueryDto) {
    const {
      type,
      categoryId,
      accountId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = query;

    const where: any = { userId };

    if (type) where.type = type;
    if (categoryId) where.categoryId = categoryId;
    if (accountId) where.accountId = accountId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          account: true,
          category: true,
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        account: true,
        category: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(userId: string, id: string, updateTransactionDto: UpdateTransactionDto) {
    const existingTransaction = await this.findOne(userId, id);
    
    const { amount, description, type, date, accountId, categoryId } = updateTransactionDto;

    // If amount or type changes, update account balance
    if (amount !== undefined || type !== undefined) {
      const oldAmount = existingTransaction.amount;
      const oldType = existingTransaction.type;
      const newAmount = amount ?? oldAmount;
      const newType = type ?? oldType;

      // Revert old transaction effect
      if (oldType === 'income') {
        await this.prisma.account.update({
          where: { id: existingTransaction.accountId },
          data: { balance: { decrement: oldAmount } },
        });
      } else if (oldType === 'expense') {
        await this.prisma.account.update({
          where: { id: existingTransaction.accountId },
          data: { balance: { increment: oldAmount } },
        });
      }

      // Apply new transaction effect
      if (newType === 'income') {
        await this.prisma.account.update({
          where: { id: existingTransaction.accountId },
          data: { balance: { increment: newAmount } },
        });
      } else if (newType === 'expense') {
        await this.prisma.account.update({
          where: { id: existingTransaction.accountId },
          data: { balance: { decrement: newAmount } },
        });
      }
    }

    const updatedTransaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        ...(amount !== undefined && { amount }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(accountId !== undefined && { accountId }),
        ...(categoryId !== undefined && { categoryId }),
      },
      include: {
        account: true,
        category: true,
      },
    });

    return updatedTransaction;
  }

  async remove(userId: string, id: string) {
    const transaction = await this.findOne(userId, id);

    // Revert transaction effect on account balance
    if (transaction.type === 'income') {
      await this.prisma.account.update({
        where: { id: transaction.accountId },
        data: { balance: { decrement: transaction.amount } },
      });
    } else if (transaction.type === 'expense') {
      await this.prisma.account.update({
        where: { id: transaction.accountId },
        data: { balance: { increment: transaction.amount } },
      });
    }

    await this.prisma.transaction.delete({
      where: { id },
    });

    return { message: 'Transaction deleted successfully' };
  }

  async getStatistics(userId: string) {
    const [totalIncome, totalExpenses, transactionCount] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { userId, type: 'income' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { userId, type: 'expense' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.count({
        where: { userId },
      }),
    ]);

    return {
      totalIncome: totalIncome._sum.amount || 0,
      totalExpenses: totalExpenses._sum.amount || 0,
      balance: (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0),
      transactionCount,
    };
  }
}