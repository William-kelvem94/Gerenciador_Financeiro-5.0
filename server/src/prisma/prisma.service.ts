import { PrismaClient } from '@prisma/client';

/**
 * Extende o tipo global NodeJS para incluir prisma.
 */
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}


class PrismaService extends PrismaClient {
    constructor() {
        super({
            log: ['query', 'info', 'warn', 'error'],
        });
        if (process.env.NODE_ENV !== 'production') {
            // Singleton para dev
            if (!global.prisma) {
                global.prisma = this;
            }
            return global.prisma;
        }
    }
}

const prismaClient = process.env.NODE_ENV === 'production'
    ? new PrismaService()
    : global.prisma ?? (global.prisma = new PrismaService());

// Opcional: conectar explicitamente e logar status

prismaClient.$connect()
    .then(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('PrismaService conectado (dev)');
        }
    })
    .catch((err) => {
        console.error('Erro ao conectar PrismaService:', err);
    });


export const prisma = prismaClient;
export default prismaClient;
export { PrismaService };
