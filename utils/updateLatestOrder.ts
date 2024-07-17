import { Socket } from "socket.io";
import getMyLatestOrder from "../api/getMyLatestOrder";

async function updateLatestOrder(socket: Socket, tableSession: string) {
    const order = await getMyLatestOrder(tableSession);

    if (order.error) return socket.emit("non displayable error", order);
    const response = order.data || [];
    socket.emit("latest order update", {status: order.status, data: response})
}

export default updateLatestOrder;