<template>
    <div class="flex flex-col w-full h-full">
        <div v-if="order !== null" class="grid gap-3 grid-cols-1 p-3 lg:grid-cols-[minmax(0,_1fr)_440px]">
            <div class="flex flex-col gap-3">
                <OrderDetails :order="order" />
                <OrderSummary :order="order" />
            </div>

            <div class="flex flex-col w-full gap-3">
                <OrderCustomerDetails :order="order" />
                <OrderPaymentDetails @updated="reloadOrder" :order="order" />
            </div>
        </div>
    </div>
</template>

<script>
import OrderCustomerDetails from '@/components/Widgets/Orders/OrderCustomerDetails/OrderCustomerDetails.vue';
import OrderDetails from '@/components/Widgets/Orders/OrderDetails/OrderDetails.vue';
import OrderSummary from '@/components/Widgets/Orders/OrderSummary/OrderSummary.vue';
import OrderPaymentDetails from '@/components/Widgets/Orders/OrderPaymentDetails/OrderPaymentDetails.vue';

import { getOrder } from '@/services/orders';
import { getFileUrl } from '~/services/utils';

definePageMeta({
    layout: 'main',
    breadcrumbs: [{
        label: 'Orders',
        link: '/main/orders/'
    },
    {
        label: '',
        link: '/main/products/'
    }],
    sidebarLink: 'Orders'
})

export default {
    data() {
        return {
            order: null,
            loading: true,
        }
    },
    async mounted() {
        this.order = await getOrder(this.$route.params.orderId);

        // update the route info
        if (this.order) {
            this.$route.meta.breadcrumbs = [{
                label: 'Orders',
                link: '/main/orders/'
            },
            {
                label: this.order.id,
                link: `/main/orders/${this.order.id}`
            }]
        }
    },
    computed: {

    },
    methods: {
        getFileUrl,
        async reloadOrder() {
            this.order = await getOrder(this.$route.params.orderId);

            // update the route info
            if (this.order) {
                this.$route.meta.breadcrumbs = [{
                    label: 'Orders',
                    link: '/main/orders/'
                },
                {
                    label: this.order.id,
                    link: `/main/orders/${this.order.id}`
                }]
            }
        }
    },
    components: {
        OrderCustomerDetails,
        OrderDetails,
        OrderSummary,
        OrderPaymentDetails
    }
}
</script>