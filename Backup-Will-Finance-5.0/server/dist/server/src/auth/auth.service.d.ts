import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: {
        email: string;
        name: string;
        password: string;
    }): Promise<{
        success: boolean;
        user: {
            id: string;
            name: string;
            email: string;
        };
        token: string;
    }>;
    login(data: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
        user: {
            id: string;
            email: string;
            name: string;
        };
        token: string;
    }>;
    firebaseLogin(decoded: unknown): Promise<{
        success: boolean;
        user: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            avatar: string | null;
            budgetAlerts: boolean;
            currency: string;
            dateFormat: string;
            emailNotifications: boolean;
            emailVerified: boolean;
            emailVerifiedAt: Date | null;
            goalReminders: boolean;
            isEmailPublic: boolean;
            isProfilePublic: boolean;
            language: string;
            lastLoginAt: Date | null;
            monthlyBudget: number | null;
            pushNotifications: boolean;
            savingsGoal: number | null;
            theme: string;
            timezone: string;
            twoFactorEnabled: boolean;
            twoFactorSecret: string | null;
        };
        token: string;
        firebaseUid: string;
        provider: string;
    }>;
}
