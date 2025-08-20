"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getCategories = async (req, res, next) => {
    try {
        const userId = req.user?.id || 'user-1';
        const categories = await prisma.category.findMany({ where: { userId } });
        res.json({ success: true, data: categories });
    }
    catch (error) {
        next(error);
    }
};
exports.getCategories = getCategories;
//# sourceMappingURL=categories.controller.js.map