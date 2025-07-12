import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { ReportQueryDto } from './dto/report.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guards';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get financial overview report' })
  getFinancialOverview(@Req() req: any, @Query() query: ReportQueryDto) {
    return this.reportsService.getFinancialOverview(req.user.id, query);
  }

  @Get('income-vs-expenses')
  @ApiOperation({ summary: 'Get income vs expenses report' })
  getIncomeVsExpenses(@Req() req: any, @Query() query: ReportQueryDto) {
    return this.reportsService.getIncomeVsExpenses(req.user.id, query);
  }

  @Get('cash-flow')
  @ApiOperation({ summary: 'Get cash flow report' })
  getCashFlow(@Req() req: any, @Query() query: ReportQueryDto) {
    return this.reportsService.getCashFlow(req.user.id, query);
  }

  @Get('top-categories')
  @ApiOperation({ summary: 'Get top spending categories' })
  getTopCategories(@Req() req: any, @Query() query: ReportQueryDto) {
    return this.reportsService.getTopCategories(req.user.id, query);
  }

  @Get('monthly-trends')
  @ApiOperation({ summary: 'Get monthly trends for the last 12 months' })
  getMonthlyTrends(@Req() req: any) {
    return this.reportsService.getMonthlyTrends(req.user.id);
  }
}