"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({ take: 50 });
        res.json({ success: true, data: users });
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
//# sourceMappingURL=users.controller.js.map