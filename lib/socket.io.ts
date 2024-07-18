import { Server } from "socket.io";
import { redisHUpsert, redisSet } from "./redis";
import crypto from "crypto";

import connectionEvent from "../events/connection.event";
import orderEvent from "../events/order.event";
import cartEvent from "../events/cart.event";
import sessionEvent from "../events/session.event";

const io = globalThis.io || new Server({
    cors: {
       origin: process.env.LOCALHOST_URL
    }
});

export default io;

export function getSocket() {
    
    io.on("connection", async (socket) => {
        console.log("user connected: ", socket.id);
        const {userSession, tableSession, tableNo, deviceSessionId } = socket.handshake.query as {userSession: string, tableSession: string, tableNo: string, deviceSessionId: string};
    
        if (!userSession && !tableSession) return socket.disconnect(true);
        
        if (userSession) await redisSet(`user-session-${userSession}`, socket.id);
        if (tableSession && tableNo) await redisSet(`customer-session-${tableSession}`);

        connectionEvent(socket);
        orderEvent(socket);
        cartEvent(socket);
        sessionEvent(socket);
    });
}