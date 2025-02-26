import { redisHGetAll } from "../lib/redis";
import getKeysWithPrefix from "./getKeysWithPrefix";

async function getAllTableSessions() {
    const prefix = `table-session:`;
    const tableSessionKeys = await getKeysWithPrefix(prefix);
    const tableSessions = [];

    for (let i = 0;i < tableSessionKeys.length;i++) {
        const key = tableSessionKeys[i];
        const {session, createdAt, socketId, status, tableNo } = (await redisHGetAll(key)).data;
        tableSessions.push({session, createdAt: (new Date(Number(createdAt))), socketId, status: Boolean(Number(status)), tableNo });
    }
    
    return tableSessions;
}

export default getAllTableSessions;