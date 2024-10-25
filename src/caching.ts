import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
    if (!redisClient) {
        redisClient = createClient({
            url: process.env.REDIS_URI,
        });
        redisClient.on('error', (err) => console.log('Redis Client Error', err));
        await redisClient.connect();
    }
    return redisClient;
}
