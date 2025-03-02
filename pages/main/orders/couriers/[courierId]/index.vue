<template>
    <div class="flex flex-col w-full h-full">
        <div v-if="courier !== null" class="grid gap-3 grid-cols-1 p-3">
            <div class="flex flex-col gap-3">
                <CourierDetails @updated="reloadCourier" :courier="courier" />
                <CourierDeliveries @updated="reloadCourier" :courier="courier" />
            </div>
        </div>
    </div>
</template>

<script>
import { getCourier } from '@/services/orders';
import { getFileUrl } from '~/services/utils';

import CourierDetails from '@/components/Widgets/Couriers/CourierDetails/CourierDetails.vue';
import CourierDeliveries from '@/components/Widgets/Couriers/CourierDeliveries/CourierDeliveries.vue';


definePageMeta({
    layout: 'main',
    breadcrumbs: [{
        label: 'Couriers',
        link: '/main/orders/couriers/'
    },
    {
        label: '',
        link: '/main/orders/couriers/'
    }],
    sidebarLink: 'Orders-Couriers'
});


export default {
    data() {
        return {
            courier: null,
            loading: true,
        }
    },
    async mounted() {
        this.courier = await getCourier(this.$route.params.courierId);

        // update the route info
        if (this.courier) {
            this.$route.meta.breadcrumbs = [{
                label: 'Couriers',
                link: '/main/customers/'
            },
            {
                label: this.courier.name,
                link: `/main/customers/${this.courier.id}`
            }]
        }
    },
    computed: {

    },
    methods: {
        getFileUrl,
        async reloadCustomer() {
            this.customer = await getCourier(this.$route.params.courierId);

        // update the route info
        if (this.courier) {
            this.$route.meta.breadcrumbs = [{
                label: 'Couriers',
                link: '/main/order/couriers/'
            },
            {
                label: this.courier.name,
                link: `/main/courier/${this.courier.id}`
            }]
        }
        }
    },
    components: {
        CourierDetails,
        CourierDeliveries
    }
}
</script>