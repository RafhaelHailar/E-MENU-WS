import { Socket } from "socket.io";
import { redisDel, redisGet, redisSet } from "../lib/redis";
import sendCartItemsUpdate from "../utils/sendCartItemsUpdate";
import getMyStatus from "../api/getMyStatus";


export default async function(socket: Socket) {
    const { tableSession } = socket.handshake.query as  { tableSession: string }; 

    socket.on("add cart", async (data) => {
        const productId = data.productId;
        const tableStatus = await getMyStatus(tableSession);

        if (tableStatus.error) return socket.emit("erro cart action", tableStatus);

        const key = `${tableSession}-cart:${productId}`;

        const cartItemQuantity = await redisGet(key);

        if (cartItemQuantity.error) return socket.emit("error", cartItemQuantity);

        if (!cartItemQuantity.data) 
            await redisSet(key, 1);
        else 
            await redisSet(key, Number(cartItemQuantity.data) + 1);
        
        await sendCartItemsUpdate(socket, tableSession);
    });

    socket.on("sub cart", async (data) => {
        const productId = data.productId;
        const tableStatus = await getMyStatus(tableSession);

        if (tableStatus.error) return socket.emit("error cart action", tableStatus);

        const key = `${tableSession}-cart:${productId}`;

        const cartItemQuantity = await redisGet(key);
        
        if (cartItemQuantity.data !== null && cartItemQuantity.data !== undefined) {
            const newQuantity = Number(cartItemQuantity.data) - 1;
            if (newQuantity <= 0) await redisDel(key);
            else await redisSet(key, newQuantity);
            await sendCartItemsUpdate(socket, tableSession);
        }
        
    });

    // send cart items data
    try {
        await sendCartItemsUpdate(socket, tableSession);
    } catch (e) {
        console.log(e);
    }
}
