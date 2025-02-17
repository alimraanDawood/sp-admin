<template>
    <div class="flex flex-col w-full h-full p-3">
        <div class="flex flex-col bg-white w-full max-h-full">
            <div class="flex flex-row p-3 border rounded-t-xl">
                <span class="text-2xl font-medium">Orders</span>

                <div class="flex flex-row ml-auto gap-2">
                    <div class="flex flex-row items-center gap-1">
                        <div
                            class="flex flex-row items-center gap-1 border-2 rounded-lg p-1 focus-within:border-primary">
                            <PhosphorIconMagnifyingGlass :size="18" />

                            <input placeholder="Search Orders" v-model="search.query"
                                class="bg-transparent focus:outline-none placeholder:text-sm text-sm" />

                            <button>
                                <PhosphorIconX :size="16" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col w-full border-x">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order Number</TableHead>
                            <TableHead>Customer Name</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead><!-- Actions --></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody v-if="page">
                        <TableRow class="cursor-pointer" @click="$router.push(`/main/orders/${order.id}`)"
                            v-for="order in page?.items" :key="order.id">
                            <TableCell class="font-medium">#{{ order.orderNumber }}</TableCell>
                            <TableCell>{{ order.expand?.customer?.name }}</TableCell>
                            <TableCell>{{order.expand?.orderItems?.map(item => item.name).join(', ').slice(0, 50)}} ...</TableCell>
                            <TableCell>{{ order.total }}</TableCell>
                            <TableCell>
                                <div v-if="order.paymentStatus === 'COMPLETED'" class="flex flex-row p-1 px-2 rounded-full border border-green-500 text-xs bg-green-500 items-center justify-center font-medium text-white">
                                    Completed
                                </div>

                                <div v-else-if="order.paymentStatus === 'PENDING'" class="flex flex-row p-1 px-2 rounded-full border border-orange-500 text-xs bg-orange-500 items-center justify-center font-medium text-white">
                                    Pending
                                </div>
                            </TableCell>
                            <TableCell>
                                <div v-if="order.orderStatus === 'COMPLETED'" class="flex flex-row p-1 px-2 rounded-full border border-green-500 text-xs bg-green-500 items-center justify-center font-medium text-white">
                                    Completed
                                </div>

                                <div v-else-if="order.orderStatus === 'PENDING'" class="flex flex-row p-1 px-2 rounded-full border border-orange-500 text-xs bg-orange-500 items-center justify-center font-medium text-white">
                                    Pending
                                </div>
                                
                                <div v-else-if="order.orderStatus === 'SHIPPED'" class="flex flex-row p-1 px-2 rounded-full border border-blue-500 text-xs bg-blue-500 items-center justify-center font-medium text-white">
                                    Shipped
                                </div>

                                <div v-else-if="order.orderStatus === 'DELIVERED'" class="flex flex-row p-1 px-2 rounded-full border border-teal-500 text-xs bg-teal-500 items-center justify-center font-medium text-white">
                                    Delivered
                                </div>

                                <div v-else-if="order.orderStatus === 'CANCELLED'" class="flex flex-row p-1 px-2 rounded-full border border-red-500 text-xs bg-red-500 items-center justify-center font-medium text-white">
                                    Cancelled
                                </div>
                            </TableCell>
                            <TableCell>{{ order.created }}</TableCell>
                            <TableCell class="text-center">
                                <button>
                                    <PhosphorIconDotsThree :size="20" />
                                </button>
                            </TableCell>
                        </TableRow>
                    </TableBody>

                    <TableBody v-else>
                        <TableRow class="cursor-pointer" v-for="i in 10">
                            <TableCell class="font-medium">
                                <div class="bg-black/10 w-full h-4 rounded-lg animate-pulse"></div>
                            </TableCell>
                            <TableCell>
                                <div class="bg-black/10 w-full h-4 rounded-lg animate-pulse"></div>
                            </TableCell>
                            <TableCell>
                                <div class="bg-black/10 w-full h-4 rounded-lg animate-pulse"></div>
                            </TableCell>
                            <TableCell>
                                <div class="bg-black/10 w-full h-4 rounded-lg animate-pulse"></div>
                            </TableCell>
                            <TableCell>
                                <div class="bg-black/10 w-full h-4 rounded-lg animate-pulse"></div>
                            </TableCell>
                            <TableCell>
                                <div class="bg-black/10 w-full h-4 rounded-lg animate-pulse"></div>
                            </TableCell>
                            <TableCell>
                                <div class="bg-black/10 w-full h-4 rounded-lg animate-pulse"></div>
                            </TableCell>
                            <TableCell>
                                <div class="bg-black/10 w-full h-4 rounded-lg animate-pulse"></div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            

            <div class="flex flex-row p-3 border rounded-b-xl">
                <div v-if="page" class="flex flex-row gap-3 items-center whitespace-nowrap">
                    Page {{ page.page }} of {{ page.totalPages }} pages

                    <div class="flex flex-row w-full gap-2 items-center">
                        <button @click="prevPage" :disabled="page.page === 1" v-wave
                            class="disabled:opacity-50 p-2 border shadow rounded">
                            <PhosphorIconCaretLeft :size="18" />
                        </button>

                        <button @click="nextPage" :disabled="page.page === page.totalPages" v-wave
                            class="disabled:opacity-50 p-2 border shadow rounded">
                            <PhosphorIconCaretRight :size="18" />
                        </button>
                    </div>
                </div>
                <div v-else class="flex flex-row items-center">
                    <div class="h-8 w-32 bg-black/5 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getOrders, searchOrders } from '~/services/orders';
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
            _page: null,

            search: {
                query: '',
                _page: null
            }
        }
    },
    async mounted() {
        this.page = this.search.query.length === 0 ? await getOrders(1, 10) : await searchOrders(this.search.query, 1, 10);
    },
    methods: {
        getFileUrl,
        async reloadOrders() {
            this.page = await getOrders(1, 10);
        },
        async nextPage() {
            if(this.page) {
                if(this.page.page < this.page.totalPages) {
                    this.page = this.search.query.length === 0 ? await getOrders(this.page.page + 1, 10) : await searchOrders(this.search.query, this.page.page + 1, 10);
                    return;
                }
            }

            this.page = this.search.query.length === 0 ? await getOrders(1, 10) : await searchOrders(this.search.query, 1, 10);
        },
        async prevPage() {
            if(this.page) {
                if(this.page.page > 1) {
                    this.page = this.search.query.length === 0 ? await getOrders(this.page.page - 1, 10) : await searchOrders(this.search.query, this.page.page - 1, 10);
                    return;
                }
            }

            this.page = this.search.query.length === 0 ? await getOrders(1, 10) : await searchOrders(this.search.query, 1, 10);
        },
    },
    computed: {
        page: {
            get() {
                if(this.search.query) {
                    return this.search._page;
                }

                return this._page;
            },
            set(value) {
                if(this.search.query) {
                    this.search._page = value;
                }

                this._page = value;
            }
        }
    },
    components: {
    },
    watch: {
        'search.query': async function(newVal, oldVal) {
            this.page = this.search.query.length === 0 ? await getOrders(1, 10) : await searchOrders(this.search.query, 1, 10);
        },
    }
}
</script>
