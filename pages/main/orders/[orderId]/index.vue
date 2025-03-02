<template>
    <div class="flex flex-col w-full h-full">
        <div v-if="order !== null" class="grid gap-3 grid-cols-1 p-3 lg:grid-cols-[minmax(0,_1fr)_440px]">
            <div class="flex flex-col gap-3">
                <OrderDetails @updated="reloadOrder" :order="order" />
                <OrderSummary :order="order" />
                <OrderPaymentDetails @updated="reloadOrder" :order="order" />
            </div>

            <div class="flex flex-col w-full gap-3">
                <OrderCustomerDetails :order="order" />
                <OrderDelivery :order="order" @updated="reloadOrder" />
            </div>
        </div>
    </div>
</template>

<script>
import OrderCustomerDetails from '@/components/Widgets/Orders/OrderCustomerDetails/OrderCustomerDetails.vue';
import OrderDetails from '@/components/Widgets/Orders/OrderDetails/OrderDetails.vue';
import OrderSummary from '@/components/Widgets/Orders/OrderSummary/OrderSummary.vue';
import OrderPaymentDetails from '@/components/Widgets/Orders/OrderPaymentDetails/OrderPaymentDetails.vue';
import OrderDelivery from '@/components/Widgets/Orders/OrderDelivery/OrderDelivery.vue';
import { getOrder } from '@/services/orders';
import { getFileUrl } from '~/services/utils';
import { toast } from 'vue-sonner';

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
            const result = getOrder(this.$route.params.orderId);
            
            toast.promise(result, {
                loading: 'Reloading Order ...',
                success: (data) => {
                    this.order = data;
                    return `Order reloaded successfully!`;
                },
                error: () => 'We were unable to reload the order status at this time!',
            });

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
        OrderPaymentDetails,
        OrderDelivery
    }
}
</script>