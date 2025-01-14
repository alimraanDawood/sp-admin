import Pocketbase from 'pocketbase';

const pocketbase  = new Pocketbase("https://sports-palace.pockethost.io");

export async function getProducts(page : number, numPerPage : number) {
    try {
        const results = await pocketbase.collection('products').getList(page, numPerPage);
        return results;
    } catch(e) {
        throw(e);
    }
}