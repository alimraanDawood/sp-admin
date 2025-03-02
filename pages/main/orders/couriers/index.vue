<template>
    <div class="flex flex-col w-full h-full p-3">
        <div class="flex flex-col bg-white w-full max-h-full">
            <div class="flex flex-row p-3 border rounded-t-xl">
                <span class="text-2xl font-medium">Couriers</span>

                <div class="flex flex-row ml-auto gap-2">
                    <div class="flex flex-row items-center gap-1">
                        <div
                            class="flex flex-row items-center gap-1 border-2 rounded-lg p-1 focus-within:border-primary">
                            <PhosphorIconMagnifyingGlass :size="18" />

                            <input placeholder="Search Couriers" v-model="search.query"
                                class="bg-transparent focus:outline-none placeholder:text-sm text-sm" />

                            <button>
                                <PhosphorIconX :size="16" />
                            </button>
                        </div>
                    </div>

                    <CreateCourier @updated="reloadCouriers" />
                </div>
            </div>
            <div class="flex flex-col w-full border-x">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Courier Name</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>Plate Number</TableHead>
                            <TableHead><!-- Actions --></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody v-if="page">
                        <TableRow class="cursor-pointer" @click="$router.push(`/main/orders/couriers/${courier.id}`)"
                            v-for="courier in page?.items" :key="courier.id">
                            <TableCell class="font-medium">{{ courier.name }}</TableCell>
                            <TableCell>{{ courier.phone }}</TableCell>
                            <TableCell>{{ courier.plateNumber }}</TableCell>
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
import { getCouriers, searchCouriers } from '~/services/orders';
import { getFileUrl } from '~/services/utils';

import CreateCourier from '@/components/Widgets/Couriers/CreateCourier/CreateCourier.vue';

definePageMeta({
    layout: 'main',
    breadcrumbs: [{
        label: 'Couriers',
        link: '/main/orders/couriers/'
    }],
    sidebarLink: 'Orders-Couriers'
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
        this.page = this.search.query.length === 0 ? await getCouriers(1, 10) : await searchCouriers(this.search.query, 1, 10);
    },
    methods: {
        getFileUrl,
        async reloadCouriers() {
            this.page = await getCouriers(1, 10);
        },
        async nextPage() {
            if(this.page) {
                if(this.page.page < this.page.totalPages) {
                    this.page = this.search.query.length === 0 ? await getCouriers(this.page.page + 1, 10) : await searchCouriers(this.search.query, this.page.page + 1, 10);
                    return;
                }
            }

            this.page = this.search.query.length === 0 ? await getCouriers(1, 10) : await searchCouriers(this.search.query, 1, 10);
        },
        async prevPage() {
            if(this.page) {
                if(this.page.page > 1) {
                    this.page = this.search.query.length === 0 ? await getCouriers(this.page.page - 1, 10) : await searchCouriers(this.search.query, this.page.page - 1, 10);
                    return;
                }
            }

            this.page = this.search.query.length === 0 ? await getCouriers(1, 10) : await searchCouriers(this.search.query, 1, 10);
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
        CreateCourier
    },
    watch: {
        'search.query': async function(newVal, oldVal) {
            this.page = this.search.query.length === 0 ? await getCouriers(1, 10) : await searchCouriers(this.search.query, 1, 10);
        },
    }
}
</script>
