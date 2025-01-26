<template>
    <div class="flex flex-col w-full h-full">
        <div v-if="customer !== null" class="grid gap-3 grid-cols-1 p-3">
            <div class="flex flex-col gap-3">
                <CustomerDetails @updated="reloadCustomer" :customer="customer" />
                <CustomerOrders @updated="reloadCustomer" :customer="customer" />
                <CustomerGroups @updated="reloadCustomer" :customer="customer" />
            </div>
        </div>
    </div>
</template>

<script>
import CustomerDetails from '@/components/Widgets/Customers/CustomerDetails/CustomerDetails.vue';
import CustomerOrders from '@/components/Widgets/Customers/CustomerOrders/CustomerOrders.vue';
import CustomerGroups from '@/components/Widgets/Customers/CustomerGroups/CustomerGroups.vue';
import { getCustomer } from '@/services/customers';
import { getFileUrl } from '~/services/utils';

definePageMeta({
    layout: 'main',
    breadcrumbs: [{
        label: 'Customers',
        link: '/main/customers/'
    },
    {
        label: '',
        link: '/main/products/'
    }],
    sidebarLink: 'Customers'
})

export default {
    data() {
        return {
            customer: null,
            loading: true,
        }
    },
    async mounted() {
        this.customer = await getCustomer(this.$route.params.customerId);

        // update the route info
        if (this.customer) {
            this.$route.meta.breadcrumbs = [{
                label: 'Customers',
                link: '/main/customers/'
            },
            {
                label: this.customer.name,
                link: `/main/customers/${this.customer.id}`
            }]
        }
    },
    computed: {

    },
    methods: {
        getFileUrl,
        async reloadCustomer() {
            this.customer = await getCustomer(this.$route.params.customerId);

        // update the route info
        if (this.customer) {
            this.$route.meta.breadcrumbs = [{
                label: 'Customers',
                link: '/main/customers/'
            },
            {
                label: this.customer.name,
                link: `/main/customers/${this.customer.id}`
            }]
        }
        }
    },
    components: {
        CustomerDetails,
        CustomerOrders,
        CustomerGroups
    }
}
</script>