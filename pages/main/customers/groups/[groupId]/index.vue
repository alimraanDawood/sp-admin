<template>
    <div class="flex flex-col w-full h-full">
        <div v-if="group !== null" class="grid gap-3 grid-cols-1 p-3">
            <div class="flex flex-col gap-3">
                <CustomerGroupDetails @updated="reloadGroup" :group="group" />
                <GroupCustomers @updated="reloadGroup" :group="group" />
            </div>
        </div>
    </div>
</template>

<script>
import CustomerGroupDetails from '@/components/Widgets/Customers/CustomerGroups/CustomerGroupDetails/CustomerGroupDetails.vue';
import GroupCustomers from '~/components/Widgets/Customers/CustomerGroups/GroupCustomers.vue';
import GroupProducts from '@/components/Widgets/Group/GroupProducts/GroupProducts.vue';
import { getCustomerGroup } from '@/services/customers';
import { getFileUrl } from '~/services/utils';

definePageMeta({
    layout: 'main',
    breadcrumbs: [{
        label: 'Customers',
        link: '/main/customers/'
    },
    {
        label: '',
        link: '/main/customers/'
    }],
    sidebarLink: 'Customers'
})

export default {
    data() {
        return {
            group: null,
            loading: true,
        }
    },
    async mounted() {
        this.group = await getCustomerGroup(this.$route.params.groupId);

        // update the route info
        if (this.group) {
            this.$route.meta.breadcrumbs = [{
                label: 'Groups',
                link: '/main/customers/groups/'
            },
            {
                label: this.group.name,
                link: `/main/customers/groups/${this.group.id}`
            }]
        }
    },
    computed: {

    },
    methods: {
        getFileUrl,
        async reloadGroup() {
            this.group = await getCustomerGroup(this.$route.params.groupId);

            // update the route info
            if (this.group) {
                this.$route.meta.breadcrumbs = [{
                    label: 'Groups',
                    link: '/main/customers/groups/'
                },
                {
                    label: this.group.name,
                    link: `/main/customers/groups/${this.group.id}`
                }]
            }
        }
    },
    components: {
        CustomerGroupDetails,
        GroupProducts,
        GroupCustomers
    }
}
</script>