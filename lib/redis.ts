import { Redis } from "ioredis";
import sendTableQueues from "../utils/sendTableQueues";

const redis = globalThis.redis ||  new Redis(process.env.REDIS_DB_URL);

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

    if (data === "") return { data: null };
    
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


export const redisHSet = requestHandler(async function(key: string, fields: Record<string, any>) {
    const data = await redis.hset(key, fields);

    return { data };
});

export const redisHGet = requestHandler(async function(key: string, field: string) {
    const data = await redis.hget(key, field);

    if (data === "") return { data: null };

    return { data: JSON.parse(data) };
});

export const redisHGetAll = requestHandler(async function(key: string) {
    const data = await redis.hgetall(key);

    if (!Object.keys(data).length) return {data: null};

    return { data };
});

export const redisHUpsert = requestHandler(async function(key: string, option: { create: Record<string, any>, update: Record<string, any> }) {
    const data = (await redisHGetAll(key)).data;

    if (data) {
        const update = option.update;
        await redisHSet(key, {...data, ...update});

        return { data: "updated"};
    } 

    const create = option.create;

    await redisHSet(key, create);
    await sendTableQueues();

    return { data: "created" };
});
