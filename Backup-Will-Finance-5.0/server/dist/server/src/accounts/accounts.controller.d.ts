import { AccountsService } from './accounts.service';
import { AuthenticatedRequest } from '../types/user.types';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from '@prisma/client';
export declare class AccountsController {
    private readonly accountsService;
    constructor(accountsService: AccountsService);
    listAccounts(req: AuthenticatedRequest): Promise<Account[]>;
    createAccount(body: CreateAccountDto, req: AuthenticatedRequest): Promise<Account>;
}
