import "dotenv/config";
import { Server, } from "socket.io";
import getOrCacheOrders from "./utils/getOrCacheOrders";
import login from "./api/login";
import redis from "./lib/redis";
import socketIo from "./lib/socket.io";
import("node-fetch");

const io = new Server({
    cors: {
       origin: 'http://localhost:3000'
    }
});

async function init() {
    // init socket io events
    socketIo(io);

    const session = await login(process.env.API_SERVER_LOGIN_USERNAME,process.env.API_SERVER_LOGIN_PASSWORD);

    await getOrCacheOrders(session.sessionId);
}

init().then(() => {
    io.listen(Number(process.env.PORT));
    console.log(`Listening on: ${process.env.WS_BASE_URL}`);
});

async function shutdown() {
    await redis.flushall();
    redis.disconnect(true);
    process.exit(0);
}

process.on("exit", async () => {
    console.log("redis server cleared");
});

process.on('SIGINT', async () => {
    console.log('Received SIGINT signal');
    await shutdown();
});
  
process.on('SIGTERM', async () => {
    console.log('Received SIGTERM signal');
    await shutdown();
});