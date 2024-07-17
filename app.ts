import "dotenv/config";

import getOrCacheOrders from "./utils/getOrCacheOrders";
import login from "./api/login";
import redis from "./lib/redis";
import io, { getSocket }  from "./lib/socket.io";
import("node-fetch");

async function init() {
    // init socket io events
    getSocket();

    const session = await login(process.env.API_SERVER_LOGIN_USERNAME,process.env.API_SERVER_LOGIN_PASSWORD);

    if (session.error) throw new Error("error logging in: " + session.error);

    await getOrCacheOrders(session.data.sessionId);
}

init().then(async () => {
    try {
        io.listen(Number(process.env.PORT));
        console.log(`Listening on: ${process.env.WS_BASE_URL}`);
    } catch (e) {
        await shutdown();
    }
});

async function shutdown() {
    await redis.flushall();
    console.log("redis db cleared");
    redis.disconnect(true);
    process.exit(1);
}

process.on("exit", async() => {
    await shutdown();
    console.log("app exited");
});

process.on('uncaughtException', async (e) => {
    await shutdown();
    console.log(`Uncaught Exception: ${e}`);
});

process.on('unhandledRejection', async (e) => {
    await shutdown();
    console.log(`Unhandled Rejection: ${e}`);
});