import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from '@prisma/client';
export declare class AccountsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createAccountDto: CreateAccountDto): Promise<Account>;
    findAllByUser(userId: string): Promise<Account[]>;
    findOne(id: string, userId: string): Promise<Account | null>;
    update(id: string, userId: string, updateData: Partial<CreateAccountDto>): Promise<Account>;
    remove(id: string, userId: string): Promise<Account>;
}
