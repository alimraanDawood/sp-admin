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
        const order = await pocketbase.collection('Orders').getOne(orderId, { expand: 'orderItems,customer,orderItems.variants,orderItems.variant.options,paymentOption' });
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

export async function searchOrders(query: string, page : number, numPerPage : number) {
    try {
        const order = await pocketbase.collection('Orders').getList(page, numPerPage, { expand: 'customer,orderItems,orderItems.variant,orderItems.variant.options', filter: `id ~ '${query}' || orderItems.name ~ '${query}' || customer.name ~ '${query}'`, sort: '-created' });

        return order;
    } catch(e) {
        throw(e);
    }
}