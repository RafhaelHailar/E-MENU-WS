import { Socket } from "socket.io";
import getOrCacheOrders from "../utils/getOrCacheOrders";
import redis from "../lib/redis";
import io from "../lib/socket.io";
import getOrCacheTableStatus from "../utils/getOrCacheTableStatus";
import sendCartItemsUpdate from "../utils/sendCartItemsUpdate";
import getMyStatus from "../api/getMyStatus";


export default async function(socket: Socket) {
    const { tableSession } = socket.handshake.query as  { tableSession: string }; 

    socket.on("add cart", async (data) => {
        const productId = data.productId;
        const tableStatus = await getMyStatus(tableSession);

        console.log(productId, tableStatus);
        if (tableStatus.status !== 200) return socket.emit("erro cart action", tableStatus);


        const key = `${tableSession}-cart:${productId}`;

        try {
            const cartItemQuantity = await redis.get(key);
    
            if (!cartItemQuantity) {
                await redis.set(key, 1);
            } else {
                await redis.set(key, Number(cartItemQuantity) + 1);
            }

            await sendCartItemsUpdate(socket, tableSession);
        } catch (e) {
            console.log(e);
        }
        
    });

    socket.on("sub cart", async (data) => {
        const productId = data.productId;
        const tableStatus = await getMyStatus(tableSession);

        if (tableStatus.status !== 200) return socket.emit("error cart action", tableStatus);

        const key = `${tableSession}-cart:${productId}`;

        try {
            const cartItemQuantity = await redis.get(key);
            
            if (cartItemQuantity !== null && cartItemQuantity !== undefined) {
                const newQuantity = Number(cartItemQuantity) - 1;
                if (newQuantity <= 0) await redis.del(key);
                else await redis.set(key, newQuantity);
                await sendCartItemsUpdate(socket, tableSession);
            }
        } catch (e) {
            console.log(e);
        }
        
    });

    // send cart items data
    try {
        await sendCartItemsUpdate(socket, tableSession);
    } catch (e) {
        console.log(e);
    }
}
