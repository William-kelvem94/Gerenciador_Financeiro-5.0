import { createClient } from 'redis';
declare let client: ReturnType<typeof createClient> | null;
export declare function connectRedis(): Promise<void>;
export { client };
