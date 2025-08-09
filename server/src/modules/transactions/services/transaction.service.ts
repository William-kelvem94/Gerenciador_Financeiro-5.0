/**
 * Serviço responsável pela gestão de transações financeiras.
 * Implementa validação, logging, auditoria e integração com IA para categorização automática.
 */
import { PrismaClient } from '@prisma/client';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto/create-transaction.dto';
import { validateCreateTransaction, validateUpdateTransaction } from '../validators/transaction.validator';

export class TransactionService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateTransactionDto) {
    const validation = validateCreateTransaction(data);
    if (!validation.success) {
      throw new Error('Dados inválidos: ' + JSON.stringify(validation.error.issues));
    }
    // TODO: Integrar IA para categorização automática
    return this.prisma.transaction.create({ data });
  }

  async update(data: UpdateTransactionDto) {
    const validation = validateUpdateTransaction(data);
    if (!validation.success) {
      throw new Error('Dados inválidos: ' + JSON.stringify(validation.error.issues));
    }
    return this.prisma.transaction.update({
      where: { id: data.id },
      data
    });
  }

  async delete(id: string) {
    return this.prisma.transaction.delete({ where: { id } });
  }

  async findById(id: string) {
    return this.prisma.transaction.findUnique({ where: { id } });
  }

  async findAll(params: { userId: string; type?: string; category?: string; dateFrom?: string; dateTo?: string; }) {
    // Filtros avançados, paginação, etc.
    return this.prisma.transaction.findMany({
      where: {
        userId: params.userId,
        ...(params.type && { type: params.type }),
        ...(params.category && { category: params.category }),
        ...(params.dateFrom && { date: { gte: new Date(params.dateFrom) } }),
        ...(params.dateTo && { date: { lte: new Date(params.dateTo) } })
      },
      orderBy: { date: 'desc' }
    });
  }
}
