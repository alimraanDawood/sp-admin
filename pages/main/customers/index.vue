<template>
    <div class="flex flex-col w-full h-full p-3">
        <div class="flex flex-col bg-white w-full max-h-full">
            <div class="flex flex-row p-3 border rounded-t-xl">
                <span class="text-2xl font-medium">Customers</span>

                <div class="flex flex-row ml-auto gap-2">
                    <CreateCustomer @updated="reloadCustomers" />
                </div>
            </div>
            <div v-if="page" class="flex flex-col w-full border-x">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="">
                                Customer Name
                            </TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>
                                Created
                            </TableHead>
                            <TableHead>
                                <!-- Actions -->
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow class="cursor-pointer" @click="$router.push(`/main/customers/${customer.id}`)" v-for="customer in page?.items">
                            <TableCell class="font-medium">
                                <div class="flex flex-row items-center gap-2">
                                    <span>{{ customer.name }}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {{ customer.email }}
                            </TableCell>
                            <TableCell>
                                {{ customer.phone }}
                            </TableCell>
                            <TableCell>
                                <span>{{ customer.created }}</span>
                            </TableCell>

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
                <div class="p-4 flex flex-row" v-for="i in 10">
                    <div class="h-12 flex flex-row w-full bg-black/10 rounded-lg animate-pulse"></div>
                </Div>
            </div>

            <div class="flex flex-row p-3 border rounded-b-xl">
                <div v-if="page" class="flex flex-row items-center whitespace-nowrap">
                    Page {{ page.page }} of {{ page.totalPages }} pages

                    <div class="flex flex-row w-full gap-2 items-center">
                        <button @click="prevPage"  :disabled="page.page === 1"  v-wave class="disabled:opacity-50 p-2 border shadow rounded">
                            <PhosphorIconCaretLeft :size="18" />
                        </button>

                        <button @click="nextPage" :disabled="page.page === page.totalPages"  v-wave class="disabled:opacity-50 p-2 border shadow rounded">
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
import { getProducts } from '~/services/products';
import { getCustomers } from '~/services/customers';
import { getFileUrl } from '~/services/utils';

import CreateCustomer from '~/components/Widgets/Customers/CreateCustomer/CreateCustomer.vue';

definePageMeta({
    layout: 'main',
    breadcrumbs: [{
        label: 'Customers',
        link: '/main/customers/'
    }],
    sidebarLink: 'Customers'
})

export default {
    data() {
        return {
            page: null,
        }
    },
    async mounted() {
        this.page = await getCustomers(1, 10);
    },
    methods: {
        getFileUrl,
        async reloadCustomers() {
            this.page = await getCustomers(1, 10);
        },
        async nextPage() {
            if(this.page) {
                if(this.page.page < this.page.totalPages) {
                    this.page = await getCustomers(this.page.page + 1, 10);
                    return;
                }
            }
        },
        async prevPage() {
            if(this.page) {
                if(this.page.page > 1) {
                    this.page = await getCustomers(this.page.page - 1, 10);
                    return;
                }
            }
        }
    },
    components: {
        CreateCustomer
    }
}
</script>