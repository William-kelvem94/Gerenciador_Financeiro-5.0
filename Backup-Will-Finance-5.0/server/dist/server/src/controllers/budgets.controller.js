"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudgets = getBudgets;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getBudgets(req, res, next) {
    try {
        const userId = req.user?.id || 'user-1';
        const budgets = await prisma.budget.findMany({ where: { userId } });
        res.json({ success: true, data: budgets });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=budgets.controller.js.map