import { createClient } from 'redis';
import { Logger } from '@nestjs/common';

const logger = new Logger('RedisClient');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient
  .on('error', (err: Error) => {
    logger.error('Redis Client Error', err);
  })
  .on('connect', () => {
    logger.log('Redis connected');
  });

export default redisClient;
