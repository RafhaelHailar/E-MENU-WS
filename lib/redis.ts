import { Redis } from "ioredis";

const redis = new Redis(`rediss://default:${process.env.REDIS_DB_PASSWORD}@${process.env.REDIS_DB_HOST}:${process.env.REDIS_DB_PORT}`);

export default redis;

export async function redisGet(key: string) {
    try {
        const data = await redis.get(key);

        return { data: JSON.parse(data) };
    } catch (error) {
        return { error };
    }
}

export async function redisSet(key: string, value: any) {
    try {
        const data = await redis.set(key, JSON.stringify(value));

        return { data: JSON.parse(data) };
    } catch (error) {
        return { error };
    }
}