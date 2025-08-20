"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReports = getReports;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getReports(req, res, next) {
    try {
        const userId = req.user?.id || 'user-1';
        const report = await prisma.transaction.groupBy({
            by: ['categoryId'],
            where: { userId, type: 'EXPENSE' },
            _sum: { amount: true },
        });
        res.json({ success: true, data: report });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=reports.controller.js.map