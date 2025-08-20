"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function connectDatabase() {
    try {
        await prisma.$connect();
        console.log('✅ Database connected');
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
}
//# sourceMappingURL=database.js.map