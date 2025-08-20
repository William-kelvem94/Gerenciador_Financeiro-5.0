"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = getDashboardStats;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getDashboardStats(req, res, next) {
    try {
        const userId = req.user?.id || 'user-1';
        const income = await prisma.transaction.aggregate({
            _sum: { amount: true },
            where: { userId, type: 'INCOME' },
        });
        const expense = await prisma.transaction.aggregate({
            _sum: { amount: true },
            where: { userId, type: 'EXPENSE' },
        });
        const total = await prisma.transaction.count({ where: { userId } });
        res.json({
            success: true,
            data: {
                income: income._sum.amount || 0,
                expense: expense._sum.amount || 0,
                balance: (income._sum.amount || 0) - (expense._sum.amount || 0),
                total,
            },
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=dashboard.controller.js.map