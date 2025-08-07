import { PrismaClient } from '@prisma/client';

/**
 * Extende o tipo global NodeJS para incluir prisma.
 */
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

const prismaClient =
    process.env.NODE_ENV === 'production'
        ? new PrismaClient()
        : global.prisma ?? (global.prisma = new PrismaClient({
                log: ['query', 'info', 'warn', 'error'],
            }));

// Opcional: conectar explicitamente e logar status
prismaClient.$connect()
    .then(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('Prisma Client conectado (dev)');
        }
    })
    .catch((err) => {
        console.error('Erro ao conectar Prisma Client:', err);
    });

export const prisma = prismaClient;
export default prismaClient;
