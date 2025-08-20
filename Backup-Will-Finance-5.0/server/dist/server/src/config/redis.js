"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
exports.connectRedis = connectRedis;
const redis_1 = require("redis");
let client = null;
exports.client = client;
async function connectRedis() {
    if (!client) {
        exports.client = client = (0, redis_1.createClient)({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
        });
        client.on('error', (err) => console.error('Redis Client Error', err));
        await client.connect();
        console.log('✅ Redis connected');
    }
}
//# sourceMappingURL=redis.js.map