"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(data) {
        const { email, name, password } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });
        const token = this.jwtService.sign({ userId: user.id });
        return {
            success: true,
            user,
            token,
        };
    }
    async login(data) {
        const { email, password } = data;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Credenciais inválidas');
        }
        const token = this.jwtService.sign({ userId: user.id });
        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token,
        };
    }
    async firebaseLogin(decoded) {
        if (!decoded || typeof decoded !== 'object' || !('email' in decoded)) {
            throw new Error('Usuário Firebase sem email');
        }
        const safeDecoded = decoded;
        if (typeof safeDecoded.email !== 'string') {
            throw new Error('Email do Firebase inválido');
        }
        let user = await this.prisma.user.findUnique({
            where: { email: safeDecoded.email },
        });
        if (!user) {
            await this.prisma.user.create({
                data: {
                    email: safeDecoded.email,
                    name: safeDecoded.name || safeDecoded.email,
                    password: '',
                    avatar: safeDecoded.picture || null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    budgetAlerts: true,
                    currency: 'BRL',
                    dateFormat: 'DD/MM/YYYY',
                    emailNotifications: true,
                    emailVerified: false,
                    goalReminders: true,
                    isEmailPublic: false,
                    isProfilePublic: false,
                    language: 'pt-BR',
                    monthlyBudget: null,
                    pushNotifications: true,
                    savingsGoal: null,
                    theme: 'dark',
                    timezone: 'America/Sao_Paulo',
                    twoFactorEnabled: false,
                    twoFactorSecret: null,
                },
            });
            user = await this.prisma.user.findUnique({
                where: { email: safeDecoded.email },
            });
        }
        if (!user) {
            throw new Error('Falha ao criar usuário Firebase');
        }
        const token = this.jwtService.sign({ userId: user.id });
        return {
            success: true,
            user,
            token,
            firebaseUid: safeDecoded.uid,
            provider: 'firebase',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map