import Pocketbase from 'pocketbase';

const pocketbase = new Pocketbase('https://sports-palace.pockethost.io');


export async function getOrders(page : number, numPerPage : number) {
    try {
        const order = await pocketbase.collection('Orders').getList(page, numPerPage, { expand: 'customer,orderItems' });

        return order;
    } catch(e) {
        throw(e);
    }
}

export async function getOrder(orderId : string) {
    try {
        const order = await pocketbase.collection('Orders').getOne(orderId, { expand: 'orderItems,customer' });
        return order;
    } catch(e) {
        throw(e);
    }
}