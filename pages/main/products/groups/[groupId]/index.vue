<template>
    <div class="flex flex-col w-full h-full">
        <div v-if="group !== null" class="grid gap-3 grid-cols-1 p-3">
            <div class="flex flex-col gap-3">
                <GroupDetails @updated="reloadGroup" :group="group" />
                <GroupProducts @updated="reloadGroup" :group="group" />
            </div>
        </div>
    </div>
</template>

<script>
import GroupDetails from '@/components/Widgets/Group/GroupDetails/GroupDetails.vue';
import GroupProducts from '@/components/Widgets/Group/GroupProducts/GroupProducts.vue';
import { getProductGroup } from '@/services/products';
import { getFileUrl } from '~/services/utils';

definePageMeta({
    layout: 'main',
    breadcrumbs: [{
        label: 'Product Groups',
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
            group: null,
            loading: true,
        }
    },
    async mounted() {
        this.group = await getProductGroup(this.$route.params.groupId);

        // update the route info
        if (this.group) {
            this.$route.meta.breadcrumbs = [{
                label: 'Product Groups',
                link: '/main/products/groups/'
            },
            {
                label: this.group.name,
                link: `/main/products/groups/${this.group.id}`
            }]
        }
    },
    computed: {

    },
    methods: {
        getFileUrl,
        async reloadGroup() {
            this.group = await getProductGroup(this.$route.params.groupId);

        // update the route info
        if (this.group) {
            this.$route.meta.breadcrumbs = [{
                label: 'Groups',
                link: '/main/products/groups/'
            },
            {
                label: this.group.name,
                link: `/main/groups/${this.group.id}`
            }]
        }
        }
    },
    components: {
        GroupDetails,
        GroupProducts
    }
}
</script>