/**
 * 🧪 Transaction Service Tests - Will Finance 5.0
 * 
 * Testes unitários para o serviço de transações
 */

import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto } from '../dtos/transaction.dtos';

// Mock do Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    transaction: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    account: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    category: {
      findFirst: jest.fn(),
    },
  })),
}));

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let mockPrisma: {
    transaction: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
    account: {
      findFirst: jest.Mock;
      update: jest.Mock;
    };
    category: {
      findFirst: jest.Mock;
    };
  };

  beforeEach(() => {
    transactionService = new TransactionService();
    mockPrisma = (transactionService as unknown as { prisma: typeof mockPrisma }).prisma;
  });

  describe('createTransaction', () => {
    it('deve criar uma transação com dados válidos', async () => {
      const mockTransactionData: CreateTransactionDto & { userId: string } = {
        amount: 100.50,
        description: 'Teste de transação',
        type: 'EXPENSE',
        accountId: 'account-123',
        categoryId: 'category-123',
        userId: 'user-123',
      };

      const mockAccount = {
        id: 'account-123',
        name: 'Conta Teste',
        userId: 'user-123',
      };

      const mockCategory = {
        id: 'category-123',
        name: 'Categoria Teste',
        userId: 'user-123',
      };

      const mockCreatedTransaction = {
        id: 'transaction-123',
        ...mockTransactionData,
        date: new Date(),
        status: 'COMPLETED',
        isRecurring: false,
        aiAnalyzed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        account: {
          id: 'account-123',
          name: 'Conta Teste',
          type: 'CHECKING',
          color: '#3B82F6',
          icon: 'wallet',
        },
        category: {
          id: 'category-123',
          name: 'Categoria Teste',
          color: '#6B7280',
          icon: 'tag',
          type: 'EXPENSE',
        },
      };

      mockPrisma.account.findFirst.mockResolvedValue(mockAccount);
      mockPrisma.category.findFirst.mockResolvedValue(mockCategory);
      mockPrisma.transaction.create.mockResolvedValue(mockCreatedTransaction);
      mockPrisma.transaction.findMany.mockResolvedValue([mockCreatedTransaction]);
      mockPrisma.account.update.mockResolvedValue({ ...mockAccount, balance: -100.50 });

      const result = await transactionService.createTransaction(mockTransactionData);

      expect(result).toEqual(mockCreatedTransaction);
      expect(mockPrisma.account.findFirst).toHaveBeenCalledWith({
        where: { id: mockTransactionData.accountId, userId: mockTransactionData.userId },
      });
      expect(mockPrisma.category.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockTransactionData.categoryId,
          OR: [{ userId: mockTransactionData.userId }, { isSystem: true }],
        },
      });
      expect(mockPrisma.transaction.create).toHaveBeenCalled();
    });

    it('deve lançar erro quando a conta não for encontrada', async () => {
      const mockTransactionData: CreateTransactionDto & { userId: string } = {
        amount: 100.50,
        description: 'Teste de transação',
        type: 'EXPENSE',
        accountId: 'account-inexistente',
        categoryId: 'category-123',
        userId: 'user-123',
      };

      mockPrisma.account.findFirst.mockResolvedValue(null);

      await expect(transactionService.createTransaction(mockTransactionData))
        .rejects
        .toThrow('Conta não encontrada ou não pertence ao usuário');
    });

    it('deve lançar erro quando a categoria não for encontrada', async () => {
      const mockTransactionData: CreateTransactionDto & { userId: string } = {
        amount: 100.50,
        description: 'Teste de transação',
        type: 'EXPENSE',
        accountId: 'account-123',
        categoryId: 'category-inexistente',
        userId: 'user-123',
      };

      const mockAccount = {
        id: 'account-123',
        name: 'Conta Teste',
        userId: 'user-123',
      };

      mockPrisma.account.findFirst.mockResolvedValue(mockAccount);
      mockPrisma.category.findFirst.mockResolvedValue(null);

      await expect(transactionService.createTransaction(mockTransactionData))
        .rejects
        .toThrow('Categoria não encontrada ou não acessível');
    });
  });

  describe('getTransactions', () => {
    it('deve retornar transações paginadas com filtros', async () => {
      const userId = 'user-123';
      const filters = {
        page: 1,
        limit: 10,
        type: 'EXPENSE' as const,
      };

      const mockTransactions = [
        {
          id: 'transaction-1',
          amount: 50.0,
          description: 'Transação 1',
          type: 'EXPENSE',
          date: new Date(),
          userId,
          accountId: 'account-123',
          categoryId: 'category-123',
          account: {
            id: 'account-123',
            name: 'Conta Teste',
            type: 'CHECKING',
            color: '#3B82F6',
            icon: 'wallet',
          },
          category: {
            id: 'category-123',
            name: 'Categoria Teste',
            color: '#6B7280',
            icon: 'tag',
            type: 'EXPENSE',
          },
        },
      ];

      mockPrisma.transaction.findMany.mockResolvedValue(mockTransactions);
      mockPrisma.transaction.count.mockResolvedValue(1);

      const result = await transactionService.getTransactions(userId, filters);

      expect(result).toEqual({
        transactions: mockTransactions,
        totalCount: 1,
        totalPages: 1,
        currentPage: 1,
        hasNext: false,
        hasPrevious: false,
      });

      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith({
        where: { userId, type: 'EXPENSE' },
        include: {
          account: {
            select: {
              id: true,
              name: true,
              type: true,
              color: true,
              icon: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              color: true,
              icon: true,
              type: true,
            },
          },
        },
        orderBy: { date: 'desc' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('deleteTransaction', () => {
    it('deve deletar uma transação existente', async () => {
      const transactionId = 'transaction-123';
      const userId = 'user-123';

      const mockTransaction = {
        id: transactionId,
        userId,
        accountId: 'account-123',
        amount: 100.0,
        type: 'EXPENSE',
      };

      mockPrisma.transaction.findFirst.mockResolvedValue(mockTransaction);
      mockPrisma.transaction.delete.mockResolvedValue(mockTransaction);
      mockPrisma.transaction.findMany.mockResolvedValue([]);
      mockPrisma.account.update.mockResolvedValue({});

      const result = await transactionService.deleteTransaction(transactionId, userId);

      expect(result).toBe(true);
      expect(mockPrisma.transaction.findFirst).toHaveBeenCalledWith({
        where: { id: transactionId, userId },
      });
      expect(mockPrisma.transaction.delete).toHaveBeenCalledWith({
        where: { id: transactionId },
      });
    });

    it('deve retornar false quando a transação não existe', async () => {
      const transactionId = 'transaction-inexistente';
      const userId = 'user-123';

      mockPrisma.transaction.findFirst.mockResolvedValue(null);

      const result = await transactionService.deleteTransaction(transactionId, userId);

      expect(result).toBe(false);
      expect(mockPrisma.transaction.delete).not.toHaveBeenCalled();
    });
  });
});
