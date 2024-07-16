import { Socket } from "socket.io";
import getOrCacheOrders from "../utils/getOrCacheOrders";


export default function(socket: Socket) {
    const { userSession, tableSession } = socket.handshake.query as  { userSession: string, tableSession: string }; 

    socket.on("get orders", async () => {
        const orders = await getOrCacheOrders(userSession);
        socket.emit("orders sent", JSON.parse(orders));
    });

    socket.on("update order status", async (data) => {
        const orders = JSON.parse(await getOrCacheOrders(userSession));
        console.log(orders);
        const order = orders.find(order => order.orderNo === data.orderNo);
        const orderIdx = orders.indexOf(order);
        order.status = data.status;
        orders[orderIdx] = order;

        console.log(orders);
    });
};