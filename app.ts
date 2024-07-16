import "dotenv/config";
import { Server, } from "socket.io";
import Redis from "ioredis";
import("node-fetch");

const redis = new Redis({
    host: process.env.REDIS_DB_HOST,
    port: Number(process.env.REDIS_DB_PORT),
    password: process.env.REDIS_DB_PASSWORD
});

const io = new Server({
    cookie: true,
    cors: {
       origin: 'http://localhost:3000'
    }
});

const userSessions={};
const tableSessions ={};

const email = "itsjoben@gmail.com";
const password = "joben123";

async function login() {
    const request = await fetch(`${process.env.API_SERVER_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email,password})
    });

    return await request.json();
}

async function getOrders(userSession: string) {
    const request = await fetch(`${process.env.API_SERVER_BASE_URL}/orders`, {
        credentials: "include",
        headers: {
            "Cookie": `_user_session=${userSession}`
        },
    });

    const order = await request.json();

    return order;
}

async function getOrCacheOrders(userSession: string) {
    try {
        const orders = await redis.get("orders");
        if (orders != null) return orders;
        else {
            const ordersData = await getOrders(userSession);
            console.log(ordersData)
            redis.set("orders",JSON.stringify(ordersData));
            return ordersData;
        }
    } catch (e) {
        console.error(e);
    }
}

async function init() {
    const session = await login();

    await getOrCacheOrders(session.sessionId);
}

async function getOrderByNo(userSession: string,orderNo: number) {
    const data = await getOrCacheOrders(userSession);
    const orders = JSON.parse(data);
    return orders.find(order => order.orderNo === orderNo);
}

async function updateOrderStatus(orderNo: number, status) {
   
}

io.use((socket,next) => {
    // console.log(socket.handshake.query);

    
    next();
});

io.on("connection", socket => {
    console.log("user connected: ", socket.id);
    const {userSession, tableSession} = socket.handshake.query as {userSession: string, tableSession: string};

    
    socket.on("disconnect", () => {
        console.log("user disconnected: ", socket.id);
    });
    
    if (!userSession && !tableSession) return socket.disconnect(true);
    
    if (userSession) userSessions[userSession] = socket.id;
    if (tableSession) tableSessions[tableSession] = socket.id;

    socket.on("get orders", async () => {
        const orders = await getOrCacheOrders(userSession);
        socket.emit("orders sent", JSON.parse(orders));
    })
   
    socket.on("update order status", async (data) => {
        const orders = JSON.parse(await getOrCacheOrders(userSession));
        console.log(orders);
        const order = orders.find(order => order.orderNo === data.orderNo);
        const orderIdx = orders.indexOf(order);
        order.status = data.status;
        orders[orderIdx] = order;

        console.log(orders);
    })
});

init().then(() => {
    io.listen(Number(process.env.PORT));
    console.log("Listening on: wss://localhost:8888")
});

async function shutdown() {
    await redis.flushall();
    process.exit();
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