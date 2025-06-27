import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './create-transaction.dto';

interface FindAllOptions {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  async findAll(options: FindAllOptions) {
    const { page, limit, search, category, type, startDate, endDate } = options;
    
    const query = this.repo.createQueryBuilder('transaction');
    
    if (search) {
      query.andWhere('transaction.descricao LIKE :search', { search: `%${search}%` });
    }
    
    if (category) {
      query.andWhere('transaction.categoria = :category', { category });
    }
    
    if (type) {
      query.andWhere('transaction.tipo = :type', { type });
    }
    
    if (startDate && endDate) {
      query.andWhere('transaction.data BETWEEN :startDate AND :endDate', { startDate, endDate });
    }
    
    query.orderBy('transaction.createdAt', 'DESC');
    query.skip((page - 1) * limit);
    query.take(limit);
    
    const [data, total] = await query.getManyAndCount();
    
    const formattedData = data.map(t => ({
      id: t.id,
      description: t.descricao,
      amount: Number(t.valor),
      type: t.tipo,
      category: t.categoria,
      account: t.conta || 'Conta Principal',
      date: t.data,
      note: t.observacao,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    }));
    
    return {
      data: formattedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  findOne(id: number): Promise<Transaction | null> {
    return this.repo.findOneBy({ id });
  }

  async create(data: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.repo.create({
      ...data,
      conta: data.conta || 'Conta Principal'
    });
    return this.repo.save(transaction);
  }

  async update(id: number, data: Partial<CreateTransactionDto>): Promise<Transaction> {
    await this.repo.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('Transação não encontrada');
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async findByCategory(category: string): Promise<Transaction[]> {
    return this.repo.find({
      where: { categoria: category },
      order: { createdAt: 'DESC' }
    });
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    return this.repo.find({
      where: {
        data: Between(startDate, endDate)
      },
      order: { createdAt: 'DESC' }
    });
  }
}
