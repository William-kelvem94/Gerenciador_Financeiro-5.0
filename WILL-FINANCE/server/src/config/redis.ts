import Redis from 'ioredis';
import { logger } from '../utils/logger';

let redis: Redis | null = null;

export const connectRedis = async () => {
  try {
    // Em desenvolvimento ou se REDIS_URL não estiver configurada, usar Redis mock
    if (process.env.NODE_ENV !== 'production' || !process.env.REDIS_URL) {
      const RedisMock = require('ioredis-mock');
      redis = new RedisMock();
      logger.info('📦 Using Redis Mock for development');
      return redis;
    }

    // Em produção, usar Redis real
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    redis.on('connect', () => {
      logger.info('✅ Redis connected successfully');
    });

    redis.on('error', (error) => {
      logger.error('❌ Redis connection error:', error);
    });

    redis.on('disconnect', () => {
      logger.warn('Redis disconnected');
    });

    await redis.connect();
    return redis;
  } catch (error) {
    logger.error('❌ Redis connection failed, using mock fallback:', error);
    // Fallback para Redis mock
    try {
      const RedisMock = require('ioredis-mock');
      redis = new RedisMock();
      logger.info('📦 Fallback to Redis Mock');
      return redis;
    } catch (mockError) {
      logger.error('❌ Redis Mock also failed:', mockError);
      throw mockError;
    }
  }
};

export const disconnectRedis = async () => {
  if (redis) {
    await redis.quit();
    logger.info('Redis disconnected');
  }
};

// Cache utilities
export const setCache = async (key: string, value: any, ttl: number = 3600) => {
  try {
    if (redis) {
      await redis.setex(key, ttl, JSON.stringify(value));
    }
  } catch (error) {
    logger.error('Cache set error:', error);
  }
};

export const getCache = async (key: string) => {
  try {
    if (redis) {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    }
    return null;
  } catch (error) {
    logger.error('Cache get error:', error);
    return null;
  }
};

export const deleteCache = async (key: string) => {
  try {
    if (redis) {
      await redis.del(key);
    }
  } catch (error) {
    logger.error('Cache delete error:', error);
  }
};

export const deleteCachePattern = async (pattern: string) => {
  try {
    if (redis) {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    }
  } catch (error) {
    logger.error('Cache pattern delete error:', error);
  }
};

export { redis };
