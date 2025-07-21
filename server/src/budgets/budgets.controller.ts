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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto, UpdateBudgetDto } from './dto/budget.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guards';

@ApiTags('Budgets')
@Controller('budgets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new budget' })
  create(@Req() req: any, @Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(req.user.id, createBudgetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all budgets' })
  findAll(@Req() req: any) {
    return this.budgetsService.findAll(req.user.id);
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get budget overview' })
  getBudgetOverview(@Req() req: any) {
    return this.budgetsService.getBudgetOverview(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get budget by ID' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.budgetsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update budget' })
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetsService.update(req.user.id, id, updateBudgetDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete budget' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.budgetsService.remove(req.user.id, id);
  }
}