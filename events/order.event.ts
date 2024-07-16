import { Socket } from "socket.io";
import getOrCacheOrders from "../utils/getOrCacheOrders";
import getMyLatestOrder from "../api/getMyLatestOrder";
import redis from "../lib/redis";
import io from "../lib/socket.io";


export default function(socket: Socket) {
    const { userSession, tableSession } = socket.handshake.query as  { userSession: string, tableSession: string }; 

    socket.on("get orders", async () => {
        const orders = await getOrCacheOrders(userSession);
       // console.log(orders);
        socket.emit("orders sent", JSON.parse(orders));
    });

    socket.on("update order status", async (data) => {
        const orders = JSON.parse(await getOrCacheOrders(userSession));
        const order = orders.find(order => order.orderNo === data.orderNo);
        const orderIdx = orders.indexOf(order);
        order.status = data.status;
        orders[orderIdx] = order;

        const customerSocketId = await redis.get(`table-session-${order.sessionId}`);

        if (!customerSocketId) return;
        
        const customerSocket = io.sockets.sockets.get(customerSocketId);
        console.log(order);
        console.log("sending update....");
        customerSocket.emit("latest order update", {status: 200, data: order});
        io.emit("orders sent", orders);
    });

    socket.on("my latest order status", async () => {
        const order = await getMyLatestOrder(tableSession);
        if (order.error) socket.emit("error", order.error);
        
        const response = order.status === 200 ? order.data : [];

        socket.emit("latest order update", {status: order.status, data: response})
    });
};