<template>
    <div class="flex flex-col w-full h-full">
        <div v-if="product !== null" class="grid gap-3 grid-cols-1 p-3 lg:grid-cols-[minmax(0,_1fr)_440px]">
            <div class="flex flex-col gap-3">
                <!-- Details -->
                <ProductDetails @updated="reloadProduct" :product="product" />

                <!-- Media -->
                <ProductMedia @updated="reloadProduct" :product="product" />

                <!-- Options -->
                <ProductOptions @updated="reloadProduct" :product="product" />


                <!-- Variants -->
                <ProductVariants @updated="reloadProduct" :product="product" />
            </div>

            <div class="flex flex-col gap-3">
                <div class=" w-full flex flex-col shadow overflow-hidden rounded-lg ">
                    <div class="flex bg-white items-center gap-3 flex-row border rounded-t-lg p-5">
                        <span class="text-lg font-medium">Categorization</span>

                        <button
                            class="hover:bg-black/10 ml-auto rounded-lg p-1 transition-all duration-400 ease-in-out">
                            <PhosphorIconDotsThree :size="24" />
                        </button>
                    </div>

                    <div class="flex flex-col bg-white divide-y border-x border-b runded-b-lg">
                        <div class="gap-3 grid grid-cols-2 p-5 py-3">
                            <span>Groups</span>

                            <span>{{ product.expand.groups?.length ? product.expand.groups?.map(group =>
                                group.name).join(', ') : '-' }}</span>
                        </div>

                        <div class="gap-3 grid grid-cols-2 p-5 py-3">
                            <span>Tags</span>

                            <span>{{ product.tags.length ? product.tags.split(',').join(', ') : '-' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProductDetails from '@/components/Widgets/Product/ProductDetails/ProductDetails.vue';
import ProductMedia from '@/components/Widgets/Product/ProductMedia/ProductMedia.vue';
import ProductVariants from '@/components/Widgets/Product/ProductVariants/ProductVariants.vue';
import ProductOptions from '@/components/Widgets/Product/ProductOptions/ProductOptions.vue';

import { getProduct } from '@/services/products';
import { getFileUrl } from '~/services/utils';

definePageMeta({
    layout: 'main',
    breadcrumbs: [{
        label: 'Products',
        link: '/main/products/'
    },
    {
        label: '',
        link: '/main/products/'
    }],
    sidebarLink: 'Products'
})

export default {
    data() {
        return {
            product: null,
            loading: true,
        }
    },
    async mounted() {
        this.product = await getProduct(this.$route.params.productId);

        // update the route info
        if (this.product) {
            this.$route.meta.breadcrumbs = [{
                label: 'Products',
                link: '/main/products/'
            },
            {
                label: this.product.name,
                link: `/main/products/${this.product.id}`
            }]
        }
    },
    computed: {

    },
    methods: {
        getFileUrl,
        async reloadProduct() {
            this.product = await getProduct(this.$route.params.productId);

            // update the route info
            if (this.product) {
                this.$route.meta.breadcrumbs = [{
                    label: 'Products',
                    link: '/main/products/'
                },
                {
                    label: this.product.name,
                    link: `/main/products/${this.product.id}`
                }]
            }
        }
    },
    components: {
        ProductDetails,
        ProductMedia,
        ProductVariants,
        ProductOptions,
    }
}
</script>