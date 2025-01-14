import Pocketbase from 'pocketbase';


class OrderManager {
    constructor(private pocketbase : Pocketbase) {
        this.pocketbase = pocketbase;
    }

    async getPagedOrders(pageNumber : number, pageSize : number, filter = '') {
        try {
            const results = await this.pocketbase.collection('orders').getList(pageNumber, pageSize, { sort: '-created', filter: filter, expand: 'order_items,user,payment_method' });

            return results;
        } catch(e) {
            throw(e);
        }
    }
}

const pb = new Pocketbase('https://sports-palace.pockethost.io/');
export const orderManager = new OrderManager(pb);