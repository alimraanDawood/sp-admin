import Pocketbase from 'pocketbase';

const pocketbase = new Pocketbase('http://localhost:8090');


export async function getOrders(page : number, numPerPage : number) {
    try {
        const order = await pocketbase.collection('Orders').getList(page, numPerPage, { expand: 'customer,orderItems,orderItems.variant,orderItems.variant.options' });

        return order;
    } catch(e) {
        throw(e);
    }
}

export async function getOrder(orderId : string) {
    try {
        const order = await pocketbase.collection('Orders').getOne(orderId, { expand: 'orderItems,customer,orderItems.variants,orderItems.variant.options,paymentOption' });
        return order;
    } catch(e) {
        throw(e);
    }
}