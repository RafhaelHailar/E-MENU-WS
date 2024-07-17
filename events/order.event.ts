import { Socket } from "socket.io";
import getOrCacheOrders from "../utils/getOrCacheOrders";
import getMyLatestOrder from "../api/getMyLatestOrder";
import { redisGet, redisSet } from "../lib/redis";
import io from "../lib/socket.io";
import updateOrderStatus from "../api/updateOrderStatus";
import getMyStatus from "../api/getMyStatus";
import getCartItem from "../utils/getCartItem";
import order from "../api/order";


export default function(socket: Socket) {
    const { userSession, tableSession } = socket.handshake.query as  { userSession: string, tableSession: string }; 

    socket.on("get orders", async () => {
        const orders = await getOrCacheOrders(userSession);
        socket.emit("orders sent", orders);
    });

    socket.on("update order status", async (data) => {
        const orders = (await getOrCacheOrders(userSession));

        if (orders.error) return socket.emit("error", orders);

        const order = orders.data.find(order => order.orderNo === data.orderNo);
        const orderIdx = orders.data.indexOf(order);
        order.status = data.status;
        orders[orderIdx] = order;

        const customerSocketId = await redisGet(`table-session-${order.sessionId}`);

        if (!customerSocketId.error) {
            const customerSocket = io.sockets.sockets.get(customerSocketId.data);
            console.log("sending update....");
            customerSocket.emit("latest order update", {status: 200, data: order});
        }
        
        redisSet("orders", orders);
        io.emit("orders sent", orders);
        await updateOrderStatus(userSession, data.orderNo, data.status);
    });

    socket.on("my latest order status", async () => {
        const tableStatus = await getMyStatus(tableSession);

        if (tableStatus.status !== 200) return socket.emit("error", tableStatus);

        const order = await getMyLatestOrder(tableSession);
        if (order.error) return socket.emit("error", order.error);
        
        const response = order.data || [];

        socket.emit("latest order update", {status: order.status, data: response})
    });

    socket.on("checkout cart", async ( { paymentMethod }: {paymentMethod: "ONLINE" | "CASH"}) => {
        const cartItems = await getCartItem(tableSession);

       const ordered = await order(tableSession,{items: cartItems, paymentMethod});
       
       if (!ordered.error) {
         
       }
    });
};