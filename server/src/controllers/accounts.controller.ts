import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  ValidationPipe,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { AccountsService } from '@/services/accounts.service';
import { AuthGuard } from '@/middlewares/auth.guard';
import { AuthenticatedRequest } from '@/types/user.types';
import { CreateAccountDto } from '@/dto/create-account.dto';
import { UpdateAccountDto } from '@/dto/update-account.dto';
import { Account } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('accounts')
@ApiBearerAuth()
@Controller('accounts')
@UseGuards(AuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as contas do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de contas retornada com sucesso.',
    type: [Account],
  })
  async listAccounts(@Req() req: AuthenticatedRequest): Promise<Account[]> {
    const user = req.user;
    return this.accountsService.findAllByUser(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova conta' })
  @ApiResponse({
    status: 201,
    description: 'A conta foi criada com sucesso.',
    type: Account,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async createAccount(
    @Body(new ValidationPipe()) createAccountDto: CreateAccountDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Account> {
    const user = req.user;
    return this.accountsService.create(user.id, createAccountDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma conta' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da conta.',
    type: Account,
  })
  @ApiResponse({ status: 404, description: 'Conta não encontrada.' })
  async getAccount(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<Account> {
    const account = await this.accountsService.findOne(id, req.user.id);
    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }
    return account;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma conta' })
  @ApiResponse({
    status: 200,
    description: 'Conta atualizada com sucesso.',
    type: Account,
  })
  @ApiResponse({ status: 404, description: 'Conta não encontrada.' })
  async updateAccount(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateAccountDto: UpdateAccountDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Account> {
    const account = await this.accountsService.findOne(id, req.user.id);
    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma conta' })
  @ApiResponse({
    status: 200,
    description: 'Conta removida com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Conta não encontrada.' })
  async deleteAccount(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string }> {
    const account = await this.accountsService.findOne(id, req.user.id);
    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }
    await this.accountsService.remove(id);
    return { message: 'Conta removida com sucesso' };
  }
}
