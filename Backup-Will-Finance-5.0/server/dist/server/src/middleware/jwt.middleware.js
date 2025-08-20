"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtMiddleware = jwtMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function jwtMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de acesso não fornecido' });
    }
    const token = authHeader.substring(7);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'object' &&
            decoded !== null &&
            'id' in decoded &&
            'email' in decoded &&
            'name' in decoded) {
            req.user = decoded;
            next();
        }
        else {
            return res.status(401).json({ error: 'Token inválido ou expirado' });
        }
    }
    catch {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}
//# sourceMappingURL=jwt.middleware.js.map