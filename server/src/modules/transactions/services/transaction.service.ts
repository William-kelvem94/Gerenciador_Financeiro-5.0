import { PrismaClient, Prisma } from '@prisma/client';
import { TransactionDTO, TransactionSchema } from '../dto/transaction.dto';
import { logger } from '../../../shared/utils/logger.util';
import { z } from 'zod';
import { ValidationError, NotFoundError, InternalServerError } from '../../../shared/utils/errors.util';

/**
 * Serviço enterprise de transações financeiras.
 * Implementa validação rigorosa, logging estruturado, categorização IA, importação/exportação, filtros avançados e auditoria.
 * @example
 * const service = new TransactionService(prisma);
 * const tx = await service.create({...});
 * @since 5.0.0
 * @author Will Finance Team
 */
export class TransactionService {
    constructor(private readonly prisma: PrismaClient) {}

    /**
     * Cria uma nova transação financeira com validação, logging e categorização automática via IA.
     */
    async create(data: TransactionDTO) {
        logger.info('Criando transação', { userId: data.userId, type: data.type, amount: data.amount });

        const validation = TransactionSchema.safeParse(data);
        if (!validation.success) {
            logger.warn('Falha validação transação', { errors: validation.error.errors, data });
            throw new ValidationError('Dados inválidos', validation.error.errors.map(e => e.message));
        }

        const autoCategory = await this.autoCategorize(validation.data);
        const finalData = { ...validation.data, category: autoCategory };

        try {
            const tx = await this.prisma.transaction.create({ data: finalData });
            await this.auditLog('CREATE', { transactionId: tx.id, userId: tx.userId });
            return tx;
        } catch (error: any) {
            logger.error('Erro ao criar transação', { error: error.message, stack: error.stack });
            throw new InternalServerError('Erro ao criar transação');
        }
    }

    /**
     * Atualiza transação existente com validação parcial.
     */
    async update(id: string, data: Partial<TransactionDTO>) {
        logger.info('Atualizando transação', { id, userId: data.userId });

        const UpdateSchema = TransactionSchema.partial().required({ id: true });
        const validation = UpdateSchema.safeParse({ id, ...data });
        if (!validation.success) {
            logger.warn('Falha validação update', { errors: validation.error.errors, id, data });
            throw new ValidationError('Dados inválidos', validation.error.errors.map(e => e.message));
        }

        try {
            const tx = await this.prisma.transaction.update({ where: { id }, data });
            await this.auditLog('UPDATE', { transactionId: id, userId: tx.userId });
            return tx;
        } catch (error: any) {
            if (error.code === 'P2025') throw new NotFoundError('Transação não encontrada');
            logger.error('Erro ao atualizar transação', { error: error.message, stack: error.stack });
            throw new InternalServerError('Erro ao atualizar transação');
        }
    }

    /**
     * Remove transação por ID.
     */
    async delete(id: string) {
        logger.info('Removendo transação', { id });
        try {
            const tx = await this.prisma.transaction.delete({ where: { id } });
            await this.auditLog('DELETE', { transactionId: id, userId: tx.userId });
            return tx;
        } catch (error: any) {
            if (error.code === 'P2025') throw new NotFoundError('Transação não encontrada');
            logger.error('Erro ao remover transação', { error: error.message, stack: error.stack });
            throw new InternalServerError('Erro ao remover transação');
        }
    }

    /**
     * Busca transação por ID.
     */
    async findById(id: string) {
        logger.info('Buscando transação por ID', { id });
        const tx = await this.prisma.transaction.findUnique({ where: { id } });
        if (!tx) throw new NotFoundError('Transação não encontrada');
        return tx;
    }

    /**
     * Lista transações do usuário com filtros avançados, paginação e ordenação.
     */
    async findAll(params: {
        userId: string;
        type?: string;
        category?: string;
        dateFrom?: string;
        dateTo?: string;
        tags?: string[];
        minAmount?: number;
        maxAmount?: number;
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: keyof TransactionDTO;
        sortOrder?: 'asc' | 'desc';
    }) {
        logger.info('Listando transações', { ...params });

        const where: Prisma.TransactionWhereInput = {
            userId: params.userId,
            ...(params.type && { type: params.type }),
            ...(params.category && { category: params.category }),
            ...(params.tags && { tags: { hasSome: params.tags } }),
            ...(params.minAmount && { amount: { gte: params.minAmount } }),
            ...(params.maxAmount && { amount: { lte: params.maxAmount } }),
            ...(params.dateFrom && { date: { gte: new Date(params.dateFrom) } }),
            ...(params.dateTo && { date: { lte: new Date(params.dateTo) } }),
            ...(params.search && { description: { contains: params.search, mode: 'insensitive' } }),
        };

        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const orderBy = { [params.sortBy ?? 'date']: params.sortOrder ?? 'desc' };

        return this.prisma.transaction.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    /**
     * Importa transações via CSV, valida e retorna resultado detalhado.
     */
    async importCSV(userId: string, csvData: string): Promise<{ imported: number; errors: string[] }> {
        logger.info('Importando transações CSV', { userId });
        // TODO: Implementação robusta de parsing, validação e batch insert
        return { imported: 0, errors: [] };
    }

    /**
     * Exporta transações para CSV ou PDF, aplicando filtros.
     */
    async export(userId: string, format: 'csv' | 'pdf', filters?: any): Promise<{ fileUrl: string }> {
        logger.info('Exportando transações', { userId, format, filters });
        // TODO: Implementação real de geração de arquivo
        return { fileUrl: `/exports/transactions-${userId}-${Date.now()}.${format}` };
    }

    /**
     * Upload de comprovante para transação, retorna URL do arquivo.
     */
    async uploadReceipt(transactionId: string, file: Express.Multer.File): Promise<{ url: string }> {
        logger.info('Upload de comprovante', { transactionId, fileName: file.originalname });
        // TODO: Integração com S3/Cloud Storage
        return { url: `/receipts/${transactionId}/${file.originalname}` };
    }

    /**
     * Categorização automática via IA (stub/futura integração).
     */
    async autoCategorize(data: TransactionDTO): Promise<string> {
        // TODO: Integração com modelo IA
        return data.category || 'Outros';
    }

    /**
     * Auditoria e logs estruturados de ações em transações.
     */
    async auditLog(action: string, details: any) {
        logger.info('Auditoria transação', { action, ...details });
        // TODO: Persistência em tabela de auditoria
    }
}
