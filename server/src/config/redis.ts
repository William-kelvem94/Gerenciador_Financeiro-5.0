import { createClient } from 'redis';

let client: ReturnType<typeof createClient> | null = null;

export async function connectRedis(): Promise<void> {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
    client.on('error', (err: unknown) =>
      console.error('Redis Client Error', err),
    );
    await client.connect();
    console.log('✅ Redis connected');
  }
}

export { client };
