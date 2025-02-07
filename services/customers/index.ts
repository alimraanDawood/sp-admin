import PocketBase from 'pocketbase';

const pocketbase = new PocketBase('https://skether.pockethost.io');

export async function getCustomers(page : number, numPerPage : number) {
    try { 
        const customers = await pocketbase.collection('Customers').getList(page, numPerPage, {});

        return customers;
    } catch(error) {
        throw(error);
    }
}

export async function createCustomer(options: any) {
    try {
        const customer = await pocketbase.collection('Customers').create({ name: options.name, email: options.email, phone: options.phone, tags: options.tags });
        return customer;
    } catch(error) {
        throw(error);
    }
}

export async function getCustomer(customerId: string) {
    try {
        const customer = await pocketbase.collection('Customers').getOne(customerId, { expand: 'orders, orders.orderItems' });
        return customer;
    } catch(error) {
        throw(error);
    }
}

export async function updateCustomer(customerId : string, options: any) {
    try {
        const result = await pocketbase.collection('Customers').update(customerId, options);
        return result;
    } catch(e) {
        throw(e);
    }
}

export async function deleteCustomer(customerId : string) {
    try {
        const result = await pocketbase.collection('Customers').delete(customerId);
        return result;
    } catch(e) {
        throw(e);
    }
}

export async function getCustomerGroups(page : number, numPerPage : number) {
    try {
        const groups = await pocketbase.collection('CustomerGroups').getList(page, numPerPage, {});
        return groups;
    } catch(e) {
        throw(e);
    }
}

export async function createCustomerGroup(options: any) {
    try {
        const group = await pocketbase.collection('CustomerGroups').create(options);
        return group;
    } catch(e) {
        throw(e);
    }
}

export async function getCustomerGroup(groupId: string) {
    try {
        const group = await pocketbase.collection('CustomerGroups').getOne(groupId, { expand: 'customers' });
        return group;
    } catch(e) {
        throw(e);
    }
}

export async function updateCustomerGroup(groupId : string, options: any) {
    try {
        const result = await pocketbase.collection('CustomerGroups').update(groupId, options);
        return result;
    } catch(e) {
        throw(e);
    }
}

export async function getCustomerGroupsForCustomer(customerId : string) {
    try {
        const groups = await pocketbase.collection('CustomerGroups').getList(1, 100, { filter: `customers ~ '${customerId}'` });
        return groups.items;
    } catch(e) {
        throw(e);
    }
}

export async function deleteCustomerGroup(groupId : string) {
    try {
        const result = await pocketbase.collection('CustomerGroups').delete(groupId);
        return result;
    } catch(e) {
        throw(e);
    }
}