import { Socket } from "socket.io";
import sendTableQueues from "../utils/sendTableQueues";
import { redisGet } from "../lib/redis";

export default async function(socket: Socket) {
    const { userSession } = socket.handshake.query as  { userSession: string }; 

    socket.on("get table queues", async () => {
        await sendTableQueues();
    });

    socket.on("table session updated", async ({session,status}) => {  
        const socketId = await redisGet(`customer-session-${session}`);
        const socket = io.sockets.sockets.get(socketId);
        
        socket.emit("my table sesson update", { status });    
    });

    if (userSession) {
        await sendTableQueues();
    }
}