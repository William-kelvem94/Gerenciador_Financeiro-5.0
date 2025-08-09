import { Controller, Get, Post, Body, UseGuards, Req, ValidationPipe } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from '../types/user.types';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from '@prisma/client';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async listAccounts(@Req() req: AuthenticatedRequest): Promise<Account[]> {
    const user = req.user;
    return this.accountsService.findAllByUser(user.id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createAccount(
    @Body(ValidationPipe) body: CreateAccountDto, 
    @Req() req: AuthenticatedRequest
  ): Promise<Account> {
    const user = req.user;
    return this.accountsService.create(user.id, body);
  }
}
