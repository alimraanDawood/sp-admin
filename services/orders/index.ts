import Pocketbase from 'pocketbase';
import { useServerUrl } from '@/composables/server';

console.log(useServerUrl());
const pocketbase = new Pocketbase(useServerUrl());


export async function getOrders(page : number, numPerPage : number) {
    try {
        const order = await pocketbase.collection('Orders').getList(page, numPerPage, { expand: 'customer,orderItems,orderItems.variant,orderItems.variant.options', sort: '-created' });

        return order;
    } catch(e) {
        throw(e);
    }
}

export async function getOrder(orderId : string) {
    try {
        const order = await pocketbase.collection('Orders').getOne(orderId, { expand: 'orderItems,customer,orderItems.variants,orderItems.variant.options,paymentOption,delivery,delivery.courier' });
        return order;
    } catch(e) {
        throw(e);
    }
}

export async function updateOrder(orderId : string, options: any) {
    try {
        const order = await pocketbase.collection('Orders').update(orderId, options);
        return order;
    } catch(e) {
        throw(e);
    }
}

export async function sendPaymentConfirmationNotification(orderId : string) {
    try {
        const result = await $fetch(useServerUrl() + `/api/confirm-payment/${orderId}`);
        return result;
    } catch(e) {
        throw(e);
    }
}

export async function sendPaymentGuideNotification(orderId : string) {
    try {
        const result = await $fetch(useServerUrl() + `/api/send-payment-guide/${orderId}`);
        return result;
    } catch(e) {
        throw(e);
    }
}

export async function sendOrderReadyNotification(orderId : string) {
    try {
        const result = await $fetch(useServerUrl() + `/api/send-order-ready-notification/${orderId}`);
        return result;
    } catch(e) {
        throw(e);
    }
}

export async function searchOrders(query: string, page : number, numPerPage : number) {
    try {
        const order = await pocketbase.collection('Orders').getList(page, numPerPage, { expand: 'customer,orderItems,orderItems.variant,orderItems.variant.options', filter: `id ~ '${query}' || orderItems.name ~ '${query}' || customer.name ~ '${query}'`, sort: '-created' });

        return order;
    } catch(e) {
        throw(e);
    }
}

export async function getCouriers(page : number, numPerPage: number) {
    try {
        const couriers = await pocketbase.collection('Couriers').getList(page, numPerPage);
        return couriers;
    } catch(e) {
        throw(e);
    }
}

export async function getFullCouriers() {
    try {
        const couriers = await pocketbase.collection('Couriers').getFullList();
        return couriers;
    } catch(e) {
        throw(e);
    }
}


export async function searchCouriers(query : string, page : number, numPerPage : number) {
    try {
        const couriers = await pocketbase.collection('Couriers').getList(page, numPerPage, { filter: `name ~ '${query}' || phone ~ '${query}' || plateNumber ~ '${query}'`, sort: '-created' });
        return couriers;
    } catch(e) {
        throw(e);
    }
}

export async function createCourier(options: any) {
    try {
        const courier = await pocketbase.collection('Couriers').create(options);
        return courier;
    } catch(e) {
        throw(e);
    }
}

export async function updateCourier(courierId : string, options: any) {
    try {
        const courier = await pocketbase.collection('Couriers').update(courierId, options);
        return courier;
    } catch(e) {
        throw(e);
    }
}

export async function createDelivery(options : any) {
    try {
        const delivery = await pocketbase.collection('Deliveries').create(options);
        return delivery;
    } catch(e) {
        throw(e);
    }
}

export async function updateDelivery(deliveryId : string, options : any) {
    try {
        const result = await pocketbase.collection('Deliveries').update(deliveryId, options);
    } catch (e) {
        throw(e);
    }
}

export async function deleteDelivery(deliveryId : string) {
    try {
        const result = await pocketbase.collection('Deliveries').delete(deliveryId);

        return result;
    } catch (e) {
        throw(e);
    }
}

export async function getCourier(courierId) {
    try {
        const result = await pocketbase.collection('Couriers').getOne(courierId);

        return result;
    } catch (e) {
        throw(e);
    }
}

export async function deleteCourier(courierId : string) {
    try {
        const result = await pocketbase.collection('Couriers').delete(courierId);

        return result;
    } catch (e) {
        throw(e);
    }
}

export async function getCourierDeliveries(courierId : string) {
    try {
        const results = await pocketbase.collection('Deliveries').getFullList({ filter: `courier = '${courierId}'` });

        return results;
    } catch(e) {
        throw(e);
    }
}