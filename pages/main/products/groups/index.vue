<template>
    <div class="flex flex-col w-full h-full p-3">
        <div class="flex flex-col bg-white w-full max-h-full">
            <div class="flex flex-row p-3 border rounded-t-xl">
                <span class="text-lg lg:text-2xl font-medium">Products Groups</span>

                <div class="flex flex-row ml-auto gap-2">
                    <CreateGroup @updated="reloadGroups" />
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
                        <TableRow class="cursor-pointer" @click="$router.push(`/main/products/groups/${group.id}`)" v-for="group in groups">
                            <TableCell class="font-medium">
                                <div class="flex flex-row items-center gap-2">
                                    <div class="aspect-square w-8 bg-primary rounded bg-center bg-cover" :style="{ backgroundImage: `url('${getFileUrl(group, group.cover, { thumb: '50x50' })}')` }"></div>

                                    <span>{{ group.name }}</span>
                                </div>
                            </TableCell>
                            <TableCell>{{ group.products.length }} Products</TableCell>

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
import { getProductGroups } from '~/services/products';
import CreateGroup from '~/components/Widgets/Group/CreateGroup/CreateGroup.vue';
import { getFileUrl } from '~/services/utils';

definePageMeta({
    layout: 'main',
    breadcrumbs: [{
        label: 'Groups',
        link: '/main/products/groups/'
    }],
    sidebarLink: 'Products-Groups'
})

export default {
    data() {
        return {
            groups: []
        }
    },
    async mounted() {
        this.groups = await getProductGroups();
    },
    methods: {
        getFileUrl,
        async reloadGroups() {
            this.groups = await getProductGroups();
        }
    },
    components: {
        CreateGroup
    }
}
</script>