import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async listAccounts(@Req() req: Request) {
    const user = req['user'];
    return this.accountsService.findAll(user.id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createAccount(@Body() body: any, @Req() req: Request) {
    const user = req['user'];
    return this.accountsService.create(body, user.id);
  }
}
