import { Redis } from "ioredis";

const redis = new Redis(`rediss://default:${process.env.REDIS_DB_PASSWORD}@${process.env.REDIS_DB_HOST}:${process.env.REDIS_DB_PORT}`);

export default redis;