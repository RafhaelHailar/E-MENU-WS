import { Redis } from "ioredis";

const redis = new Redis(`rediss://default:${process.env.REDIS_DB_PASSWORD}@${process.env.REDIS_DB_HOST}:${process.env.REDIS_DB_PORT}`);

export default redis;

function requestHandler(fn: Function) {
    return async function(...params: any[]) {
        try {
            const data = await fn(...params);
            return data;
        } catch (error) {
            return { error };
        }
    }
}

export const redisGet = requestHandler(async function (key: string) {
    const data = await redis.get(key);
    return { data: JSON.parse(data) };
});

export const redisSet = requestHandler(async function(key: string, value: any) {
    const data = await redis.set(key, JSON.stringify(value));
    return { data: JSON.parse(data) };
});

export const redisDel = requestHandler(async function(key: string) {
    await redis.del(key);
    return {data: 1};
});