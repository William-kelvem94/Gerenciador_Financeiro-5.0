import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: any): Promise<{
        success: boolean;
        user: {
            id: string;
            name: string;
            email: string;
        };
        token: string;
    }>;
    firebaseLogin(body: {
        idToken: string;
    }): Promise<{
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
    } | {
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: string;
    }>;
    login(body: any): Promise<{
        success: boolean;
        user: {
            id: string;
            email: string;
            name: string;
        };
        token: string;
    }>;
    getProfile(): Promise<{
        message: string;
    }>;
}
