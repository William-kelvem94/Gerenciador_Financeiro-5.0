"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user?.id || 'user-1';
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        res.json({ success: true, data: notifications });
    }
    catch (error) {
        next(error);
    }
};
exports.getNotifications = getNotifications;
//# sourceMappingURL=notifications.controller.js.map