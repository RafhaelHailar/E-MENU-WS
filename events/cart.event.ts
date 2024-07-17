import { Socket } from "socket.io";
import { redisDel, redisGet, redisSet } from "../lib/redis";
import sendCartItemsUpdate from "../utils/sendCartItemsUpdate";
import getMyStatus from "../api/getMyStatus";
import getProductInventoryById from "../utils/getProductInventoryById";


export default async function(socket: Socket) {
    const userSession = (await redisGet("_user_session")).data;
    const { tableSession } = socket.handshake.query as  { tableSession: string }; 

    socket.on("add cart", async (data) => {
        const productId = data.productId;
        const tableStatus = await getMyStatus(tableSession);
        const inventory = await getProductInventoryById(userSession, productId);

        if (tableStatus.error) return socket.emit("error cart action", tableStatus);
        if (!tableStatus.data.status) return socket.emit("error cart action", { message: "you are not allowed to order", status: 401 });

        const key = `${tableSession}-cart:${productId}`;

        const cartItemQuantity = await redisGet(key);

        if (cartItemQuantity.error) return socket.emit("error", cartItemQuantity);

        const inventoryNewQuantity = inventory.quantity - (cartItemQuantity.data || 1);

        if (inventoryNewQuantity) return socket.emit("error cart action", { status: 400, message: "product doesn't have enough quantity" });
        
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

    if (tableSession) {
        // send cart items data
        try {
            await sendCartItemsUpdate(socket, tableSession);
        } catch (e) {
            console.log(e);
        }
    }
}
