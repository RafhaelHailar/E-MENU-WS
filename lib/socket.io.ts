import { Server } from "socket.io";
import { redisSet } from "./redis";

import connectionEvent from "../events/connection.event";
import orderEvent from "../events/order.event";
import cartEvent from "../events/cart.event";

const io = new Server({
    cors: {
       origin: [process.env.LOCALHOST_URL, process.env.FRONTEND_BASE_URL]
    }
});

export default io;

export function getSocket() {
    
    io.on("connection", async (socket) => {
        console.log("user connected: ", socket.id);
        const {userSession, tableSession} = socket.handshake.query as {userSession: string, tableSession: string};
        
        if (!userSession && !tableSession) return socket.disconnect(true);
        
        if (userSession) await redisSet(`user-session-${userSession}`, socket.id);
        if (tableSession) await redisSet(`table-session-${tableSession}`, socket.id);

        connectionEvent(socket);
        orderEvent(socket);
        cartEvent(socket);
    });
}