import { Socket } from "socket.io";
import getOrCacheOrders from "../utils/getOrCacheOrders";
import getMyLatestOrder from "../api/getMyLatestOrder";
import { redisGet, redisSet } from "../lib/redis";
import io from "../lib/socket.io";
import updateOrderStatus from "../api/updateOrderStatus";
import getMyStatus from "../api/getMyStatus";
import getCartItem from "../utils/getCartItem";
import order from "../api/order";
import clearCart from "../utils/clearCartItem";
import sendCartItemsUpdate from "../utils/sendCartItemsUpdate";
import updateLatestOrder from "../utils/updateLatestOrder";
import getOrCacheInventory from "../utils/getOrCacheInventor";


export default async function(socket: Socket) {
    const { userSession, tableSession } = socket.handshake.query as  { userSession: string, tableSession: string }; 

    socket.on("get orders", async () => {
        const orders = await getOrCacheOrders(userSession);

        if (!orders.error)
            socket.emit("orders sent", orders);
    });

    socket.on("update order status", async (data) => {
        const orders = (await getOrCacheOrders(userSession));
        if (orders.error) return socket.emit("error", orders);
        
        const order = orders.data.find(order => order.orderNo === data.orderNo);
        const orderIdx = orders.data.indexOf(order);
        order.status = data.status;
        orders.data[orderIdx] = order;

        const inventory = (await getOrCacheInventory(userSession)).data;

        if (data.status === "SERVED") {
            for (let i = 0;i < order.orders.length;i++) {
                const current = order.orders[i];
                const productId = current.product.id;
                const inventoryIdx = inventory.indexOf(inventory.find(item => item.id === productId));

                inventory[inventoryIdx] = { id: productId, quantity: inventory[inventoryIdx].quantity - current.quantity };
            }
            await redisSet("inventory", inventory);
        }
        
        const customerSocketId = await redisGet(`table-session-${order.sessionId}`);
        
        if (!customerSocketId.error && customerSocketId.data) {
            const customerSocket = io.sockets.sockets.get(customerSocketId.data);
            console.log("sending update....");
            customerSocket.emit("latest order update", {status: 200, data: order});
        }
   
        redisSet("orders", orders.data);
        io.emit("orders sent", orders);
        await updateOrderStatus(userSession, data.orderNo, data.status);
    });

    socket.on("my latest order status", async () => {
        const tableStatus = await getMyStatus(tableSession);

        if (tableStatus.status !== 200) return socket.emit("non displayable error", tableStatus);

        await updateLatestOrder(socket, tableSession);
    });

    socket.on("checkout cart", async ( { paymentMethod }: {paymentMethod: "ONLINE" | "CASH"}) => {
        const cartItems = await getCartItem(tableSession);

       const ordered = await order(tableSession,{items: cartItems, paymentMethod});
       
       if (!ordered.error) {
         const clearItem = await clearCart(tableSession);

         const order = (await getMyLatestOrder(tableSession)).data;
         const orders = (await getOrCacheOrders(userSession));

         if (!orders.error) {
            orders.data.push(order);
            io.emit("orders sent", orders); 
            await redisSet("orders", orders.data);
         }  else console.log(orders.error);

          if (clearItem) 
            console.log("cart cleared!");
          await updateLatestOrder(socket, tableSession);
          await sendCartItemsUpdate(socket, tableSession);
       }
    });

    if (tableSession) await updateLatestOrder(socket, tableSession);
    if (userSession) {
        const orders = (await getOrCacheOrders(userSession));
        if (orders.error) return socket.emit("error", orders);
        
        io.emit("orders sent", orders);
    }
};