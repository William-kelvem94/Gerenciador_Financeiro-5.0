import { IsString, IsNumber, IsDateString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BudgetPeriod {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export class CreateBudgetDto {
  @ApiProperty({ example: 'Monthly Groceries' })
  @IsString()
  name: string;

  @ApiProperty({ example: 500.00 })
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: BudgetPeriod, example: BudgetPeriod.MONTHLY })
  @IsEnum(BudgetPeriod)
  period: BudgetPeriod;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'category-id-123' })
  @IsString()
  categoryId: string;
}

export class UpdateBudgetDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ enum: BudgetPeriod, required: false })
  @IsOptional()
  @IsEnum(BudgetPeriod)
  period?: BudgetPeriod;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}