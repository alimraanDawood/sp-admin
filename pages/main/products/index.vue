<template>
    <div class="flex flex-col w-full h-full p-3">
        <div class="flex flex-col border w-full h-full rounded-lg">
            <div class="flex flex-row p-3">
                <span class="text-2xl font-medium">Products</span>

                <div class="flex flex-row ml-auto gap-2">
                    <NuxtLink to="/main/products/create" v-wave class="bg-primary text-sm font-medium text-white flex flex-row gap-2 px-4 p-2 rounded-lg items-center">
                        <PhosphorIconPlusCircle :size="20" weight="bold" />
                        Create Product
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getProducts } from '~/services/products';


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
        this.page =  await getProducts(1, 10);
    }
}
</script>