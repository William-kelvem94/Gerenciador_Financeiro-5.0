import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './create-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.service.findAll({
      page: Number(page),
      limit: Number(limit),
      search,
      category,
      type,
      startDate,
      endDate,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Transaction | null> {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() data: CreateTransactionDto): Promise<Transaction> {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<CreateTransactionDto>): Promise<Transaction> {
    return this.service.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(Number(id));
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string): Promise<Transaction[]> {
    return this.service.findByCategory(category);
  }

  @Get('date-range')
  findByDateRange(
    @Query('start') startDate: string,
    @Query('end') endDate: string
  ): Promise<Transaction[]> {
    return this.service.findByDateRange(startDate, endDate);
  }
}
