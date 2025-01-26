<template>
    <div class="flex flex-col w-full h-full p-3">
        <div class="flex flex-col bg-white w-full max-h-full">
            <div class="flex flex-row p-3 border rounded-t-xl">
                <span class="text-lg lg:text-2xl font-medium">Customer Groups</span>

                <div class="flex flex-row ml-auto gap-2">
                    <CreateCustomerGroup @updated="reloadGroups" />
                </div>
            </div>
            <div v-if="groups" class="flex flex-col w-full border-x">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="">
                                Group Name
                            </TableHead>
                            <TableHead>Products</TableHead>
                            
                            <TableHead>
                                <!-- Actions -->
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow class="cursor-pointer" @click="$router.push(`/main/customers/groups/${group.id}`)" v-for="group in groups.items">
                            <TableCell class="font-medium">
                                <div class="flex flex-row items-center gap-2">
                                    <span>{{ group.name }}</span>
                                </div>
                            </TableCell>
                            <TableCell>{{ group.customers?.length }} Customers</TableCell>

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
                <div v-if="page" class="flex flex-row items-center">
                </div>
                <div v-else class="flex flex-row items-center">
                    <div class="h-8 w-32 bg-black/5 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getCustomerGroups } from '~/services/customers';
import CreateCustomerGroup from '~/components/Widgets/Customers/CustomerGroups/CreateCustomerGroup/CreateCustomerGroup.vue';
import { getFileUrl } from '~/services/utils';

definePageMeta({
    layout: 'main',
    breadcrumbs: [{
        label: 'Customer Groups',
        link: '/main/customers/groups/'
    }],
    sidebarLink: 'Customers-Groups'
})

export default {
    data() {
        return {
            groups: []
        }
    },
    async mounted() {
        this.groups = await getCustomerGroups(1, 10);
    },
    methods: {
        getFileUrl,
        async reloadGroups() {
            this.groups = await getCustomerGroups(1, 10);
        }
    },
    components: {
        CreateCustomerGroup
    }
}
</script>