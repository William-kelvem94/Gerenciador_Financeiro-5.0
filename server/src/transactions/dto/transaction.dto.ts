import { IsString, IsNumber, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// ...existing code...

export class CreateTransactionDto {
  @ApiProperty({ example: 1500.50 })
  @IsNumber()
  amount!: number;

  @ApiProperty({ example: 'Salary payment' })
  @IsString()
  description!: string;

    @ApiProperty({ example: 'income' })
    @IsString()
    type!: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  @IsDateString()
  date!: string;

  @ApiProperty({ example: 'account-id-123' })
  @IsString()
  accountId!: string;

  @ApiProperty({ example: 'category-id-456' })
  @IsString()
  categoryId!: string;
}

export class UpdateTransactionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: TransactionType, required: false })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  accountId?: string;

}

export class TransactionQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  accountId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number;
}