import Pocketbase from 'pocketbase';

const pocketbase  = new Pocketbase("http://localhost:8090");

export async function getProducts(page : number, numPerPage : number) {
    try {
        const results = await pocketbase.collection('Products').getList(page, numPerPage);
        return results;
    } catch(e) {
        throw(e);
    }
}

export async function getProductGroups() {
    try {
        const results = await pocketbase.collection('ProductGroups').getList();
        return results.items;
    } catch(e) {
        throw(e);
    }
}

export async function getProductTags() {
    try {
        const results = await pocketbase.collection('ProductTags').getList();
        return results.items;
    } catch(e) {
        throw(e);
    }
}


export async function createProduct(variantOptions: any[], variants: any[], name: string, description: string, hasVariants: boolean) {
    // if hasVariants is false skip the creations of options
    try {
        if(hasVariants) {
            // create the variant options
            console.log(variantOptions);
        }
        console.log(variants);
    } catch(e) {}
}