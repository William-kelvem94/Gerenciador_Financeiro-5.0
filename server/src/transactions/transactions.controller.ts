import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionDto, TransactionQueryDto } from './dto/transaction.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guards';

@ApiTags('Transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  create(@Req() req: any, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(req.user.id, createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions with filtering' })
  findAll(@Req() req: any, @Query() query: TransactionQueryDto) {
    return this.transactionsService.findAll(req.user.id, query);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get transaction statistics' })
  getStatistics(@Req() req: any) {
    return this.transactionsService.getStatistics(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.transactionsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction' })
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(req.user.id, id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete transaction' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.transactionsService.remove(req.user.id, id);
  }
}