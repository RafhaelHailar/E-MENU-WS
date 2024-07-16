
import getOrCacheOrders from "./getOrCacheOrders";

async function getOrderByNo(userSession: string,orderNo: number) {
    const data = await getOrCacheOrders(userSession);
    const orders = JSON.parse(data);
    return orders.find(order => order.orderNo === orderNo);
}

export default getOrderByNo;