<template>
    <div class="flex flex-col w-full h-full p-3">
        <div class="flex flex-col bg-white w-full max-h-full">
            <div class="flex flex-row p-3 border rounded-t-xl">
                <span class="text-2xl font-medium">Products</span>

                <div class="flex flex-row ml-auto gap-2">
                    <NuxtLink to="/main/products/create" v-wave
                        class="bg-primary text-sm font-medium text-white flex flex-row gap-2 px-4 p-2 rounded-lg items-center">
                        <PhosphorIconPlusCircle :size="18" weight="bold" />
                        Create Product
                    </NuxtLink>
                </div>
            </div>
            <div v-if="page" class="flex flex-col w-full border-x">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="">
                                Product
                            </TableHead>
                            <TableHead>Variants</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>
                                Status
                            </TableHead>
                            <TableHead>
                                <!-- Actions -->
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow class="cursor-pointer" @click="$router.push(`/main/products/${product.id}`)" v-for="product in page?.items">
                            <TableCell class="font-medium">
                                <div class="flex flex-row items-center gap-2">
                                    <div class="aspect-square w-8 bg-primary rounded bg-center bg-cover" :style="{ backgroundImage: `url('${getFileUrl(product, product.thumb, { thumb: '50x50' })}')` }"></div>

                                    <span>{{ product.name }}</span>
                                </div>
                            </TableCell>
                            <TableCell>{{ product.variants.length }} variants</TableCell>
                            <TableCell>{{ product.expand.variants.reduce((total, variant) => total + variant.stock, 0) }}</TableCell>
                            <TableCell>
                                <div class="flex flex-row gap-2 text-sm items-center">
                                    <div class="bg-green-500 h-4 aspect-square rounded"></div>

                                    <span>Published</span>
                                </div>
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
                <div v-if="page" class="flex flex-row gap-3 items-center whitespace-nowrap">
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
import { getFileUrl } from '~/services/utils';

definePageMeta({
    layout: 'main',
    breadcrumbs: [{
        label: 'Products',
        link: '/main/products/'
    }],
    sidebarLink: 'Products'
})

export default {
    data() {
        return {
            page: null
        }
    },
    async mounted() {
        this.page = await getProducts(1, 10);
    },
    methods: {
        getFileUrl,
        async nextPage() {
            if(this.page) {
                if(this.page.page < this.page.totalPages) {
                    this.page = await getProducts(this.page.page + 1, 10);
                    return;
                }
            }
        },
        async prevPage() {
            if(this.page) {
                if(this.page.page > 1) {
                    this.page = await getProducts(this.page.page - 1, 10);
                    return;
                }
            }
        }
    }
}
</script>