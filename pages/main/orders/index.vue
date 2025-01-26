<template>
    <div class="flex flex-col w-full h-full p-3">
        <div class="flex flex-col bg-white w-full max-h-full">
            <div class="flex flex-row p-3 border rounded-t-xl">
                <span class="text-2xl font-medium">Orders</span>

                <div class="flex flex-row ml-auto gap-2">
                </div>
            </div>
            <div v-if="page" class="flex flex-col w-full border-x">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer Name</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead><!-- Actions --></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow class="cursor-pointer" @click="$router.push(`/main/orders/${order.id}`)" v-for="order in page?.items" :key="order.id">
                            <TableCell class="font-medium">{{ order.id }}</TableCell>
                            <TableCell>{{ order.expand.customer.name }}</TableCell>
                            <TableCell>{{ order.expand.orderItems.map(item => item.name).join(', ') }}</TableCell>
                            <TableCell>{{ order.total }}</TableCell>
                            <TableCell>{{ order.paymentStatus }}</TableCell>
                            <TableCell>{{ order.orderStatus }}</TableCell>
                            <TableCell>{{ order.created }}</TableCell>
                            <TableCell class="text-center">
                                <button>
                                    <PhosphorIconDotsThree :size="20"/>
                                </button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div v-else class="flex divide-y flex-col w-full border-x">
                <div class="p-4 flex flex-row" v-for="i in 10" :key="i">
                    <div class="h-12 flex flex-row w-full bg-black/10 rounded-lg animate-pulse"></div>
                </div>
            </div>

            <div class="flex flex-row p-3 border rounded-b-xl">
                <div v-if="page" class="flex flex-row items-center">
                    Page {{ page.page }} of {{ page.totalPages }} pages
                </div>
                <div v-else class="flex flex-row items-center">
                    <div class="h-8 w-32 bg-black/5 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getOrders } from '~/services/orders';
import { getFileUrl } from '~/services/utils';


definePageMeta({
    layout: 'main',
    breadcrumbs: [{
        label: 'Orders',
        link: '/main/orders/'
    }],
    sidebarLink: 'Orders'
})

export default {
    data() {
        return {
            page: null,
        }
    },
    async mounted() {
        this.page = await getOrders(1, 10);
    },
    methods: {
        getFileUrl,
        async reloadOrders() {
            this.page = await getOrders(1, 10);
        }
    },
    components: {
    }
}
</script>
