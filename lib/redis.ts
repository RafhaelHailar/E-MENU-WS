import { Redis } from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_DB_HOST,
    port: Number(process.env.REDIS_DB_PORT),
    password: process.env.REDIS_DB_PASSWORD
});

export default redis;