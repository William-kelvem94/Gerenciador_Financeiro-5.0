"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTransactions = async (req, res, next) => {
    try {
        const userId = req.user?.id || 'user-1';
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: 50,
        });
        res.json({ success: true, data: transactions });
    }
    catch (error) {
        next(error);
    }
};
exports.getTransactions = getTransactions;
//# sourceMappingURL=transactions.controller.js.map