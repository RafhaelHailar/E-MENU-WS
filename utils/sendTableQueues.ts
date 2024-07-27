import io from "../lib/socket.io";
import getTableSessions from "../api/getTableSessions";

async function sendTableQueues() {
    const tableSessions = await getTableSessions();
    io.emit("table queues sent", {data: tableSessions});
}

export default sendTableQueues;