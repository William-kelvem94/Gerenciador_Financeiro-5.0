"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const error_middleware_1 = require("./middleware/error.middleware");
const logger_1 = require("../../client/server/src/utils/logger");
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const socket_1 = require("./config/socket");
const firebase_1 = require("./config/firebase");
const auth_1 = __importDefault(require("./routes/auth"));
const adminAuth_1 = __importDefault(require("./routes/adminAuth"));
const googleAuth_1 = __importDefault(require("./routes/googleAuth"));
const users_1 = __importDefault(require("./routes/users"));
const accounts_1 = __importDefault(require("./routes/accounts"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const categories_1 = __importDefault(require("./routes/categories"));
const budgets_1 = __importDefault(require("./routes/budgets"));
const goals_1 = __importDefault(require("./routes/goals"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const ai_1 = __importDefault(require("./routes/ai"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const importExport_1 = __importDefault(require("./routes/importExport"));
const dataMode_1 = __importDefault(require("./routes/dataMode"));
const routes = {
    auth: auth_1.default,
    admin: adminAuth_1.default,
    'auth/google': googleAuth_1.default,
    users: users_1.default,
    accounts: accounts_1.default,
    transactions: transactions_1.default,
    categories: categories_1.default,
    budgets: budgets_1.default,
    goals: goals_1.default,
    analytics: analytics_1.default,
    ai: ai_1.default,
    notifications: notifications_1.default,
    'import-export': importExport_1.default,
    'data-mode': dataMode_1.default,
};
const DEFAULT_PORT = 8080;
const DEFAULT_CLIENT_URL = 'http://localhost:5173';
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL ?? DEFAULT_CLIENT_URL,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
exports.io = io;
const PORT = Number(process.env.PORT) || DEFAULT_PORT;
function setupSecurityMiddleware() {
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    'https://fonts.googleapis.com',
                ],
                fontSrc: ["'self'", 'https://fonts.gstatic.com'],
                imgSrc: ["'self'", 'data:', 'https:'],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                connectSrc: ["'self'", 'ws:', 'wss:', 'https:'],
            },
        },
    }));
    app.use((0, cors_1.default)({
        origin: [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:3000',
            'http://localhost:8080',
            process.env.CLIENT_URL ?? DEFAULT_CLIENT_URL,
        ],
        credentials: true,
    }));
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
        max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
        message: {
            error: 'Too many requests from this IP, please try again later.',
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use('/api/', limiter);
}
function setupAppMiddleware() {
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
}
function setupRoutesAndStaticFiles() {
    const clientBuildPath = path_1.default.join(__dirname, '../../client/dist');
    app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../../uploads')));
    app.use(express_1.default.static(clientBuildPath));
    app.get('/health', (req, res) => {
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version ?? '1.0.0',
        });
    });
    Object.entries(routes).forEach(([routeName, routeHandler]) => {
        app.use(`/api/${routeName}`, routeHandler);
    });
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api/')) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'The requested API endpoint was not found.',
            });
        }
        res.sendFile(path_1.default.join(clientBuildPath, 'index.html'));
    });
}
async function initializeServices() {
    logger_1.logger.info('🚀 Starting server initialization...');
    logger_1.logger.info('🔥 Initializing Firebase Admin SDK...');
    (0, firebase_1.initializeFirebaseAdmin)();
    logger_1.logger.info('✅ Firebase Admin SDK initialized');
    logger_1.logger.info('📦 Connecting to database...');
    await (0, database_1.connectDatabase)();
    logger_1.logger.info('✅ Database connected successfully');
    try {
        logger_1.logger.info('Conectando ao Redis...');
        await (0, redis_1.connectRedis)();
        logger_1.logger.info('✅ Redis conectado com sucesso');
    }
    catch (error) {
        logger_1.logger.error('❌ Falha ao conectar Redis:', error);
    }
    logger_1.logger.info('Setting up Socket.IO...');
    (0, socket_1.setupSocketIO)(io);
    logger_1.logger.info('✅ Socket.IO configured successfully');
}
function gracefulShutdown(signal) {
    logger_1.logger.info(`${signal} received, shutting down gracefully`);
    server.close(() => {
        logger_1.logger.info('Process terminated');
        process.exit(0);
    });
}
function setupProcessHandlers() {
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('unhandledRejection', (reason, promise) => {
        logger_1.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        server.close(() => process.exit(1));
    });
    process.on('uncaughtException', (error) => {
        logger_1.logger.error('Uncaught Exception:', error);
        server.close(() => process.exit(1));
    });
}
setupSecurityMiddleware();
setupAppMiddleware();
setupRoutesAndStaticFiles();
app.use(error_middleware_1.errorHandler);
async function startServer() {
    try {
        await initializeServices();
        server.listen(PORT, () => {
            logger_1.logger.info(`🚀 Server is running on port ${PORT}`);
            logger_1.logger.info(`🌐 API URL: http://localhost:${PORT}`);
            logger_1.logger.info(`📊 Health check: http://localhost:${PORT}/health`);
            logger_1.logger.info(`🎯 Environment: ${process.env.NODE_ENV ?? 'development'}`);
        });
        setupProcessHandlers();
    }
    catch (error) {
        logger_1.logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
void startServer();
//# sourceMappingURL=index.js.map