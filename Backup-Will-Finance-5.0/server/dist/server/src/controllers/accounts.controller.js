"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccounts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAccounts = async (req, res, next) => {
    try {
        const userId = req.user?.id || 'user-1';
        const accounts = await prisma.account.findMany({ where: { userId } });
        res.json({ success: true, data: accounts });
    }
    catch (error) {
        next(error);
    }
};
exports.getAccounts = getAccounts;
//# sourceMappingURL=accounts.controller.js.map