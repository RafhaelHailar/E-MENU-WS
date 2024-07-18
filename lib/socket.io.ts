import { Server } from "socket.io";
import { redisHUpsert, redisSet } from "./redis";

import connectionEvent from "../events/connection.event";
import orderEvent from "../events/order.event";
import cartEvent from "../events/cart.event";
import sessionEvent from "../events/session.event";

const io = globalThis.io || new Server({
    cors: {
       origin: [process.env.LOCALHOST_URL, process.env.FRONTEND_BASE_URL]
    }
});

export default io;

export function getSocket() {
    
    io.on("connection", async (socket) => {
        console.log("user connected: ", socket.id);
        const {userSession, tableSession, tableNo } = socket.handshake.query as {userSession: string, tableSession: string, tableNo: string};
    
        if (!userSession && !tableSession) return socket.disconnect(true);
        
        if (userSession) await redisSet(`user-session-${userSession}`, socket.id);
        if (tableSession && tableNo) {
            await redisHUpsert(`table-session:${tableSession}`, {   
                create: {
                    session: tableSession,
                    createdAt: Date.now(),
                    tableNo,
                    socketId: socket.id,
                    status: 0
                },
                update: {
                    socketId: socket.id
                }
            });
        }

        connectionEvent(socket);
        orderEvent(socket);
        cartEvent(socket);
        sessionEvent(socket);
    });
}