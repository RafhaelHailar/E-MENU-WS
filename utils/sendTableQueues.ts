import getAllTableSessions from "./getAllTableSessions";
import io from "../lib/socket.io";

async function sendTableQueues() {
    const tableSessions = await getAllTableSessions();
    io.emit("table queues sent", {data: tableSessions});
}

export default sendTableQueues;