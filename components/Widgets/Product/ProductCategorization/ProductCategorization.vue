<template>
    <div class=" w-full flex flex-col shadow overflow-hidden rounded-lg ">
        <div class="flex bg-white items-center gap-3 flex-row border rounded-t-lg p-5">
            <span class="text-lg font-medium">Categorization</span>

            <button @click="editCategorization.open = true" class="hover:bg-black/10 ml-auto rounded-lg p-2 transition-all duration-400 ease-in-out">
                <PhosphorIconPencilSimple :size="20" />
            </button>
        </div>

        <div class="flex flex-col bg-white divide-y border-x border-b runded-b-lg">
            <div class="gap-3 grid grid-cols-2 p-5 py-3">
                <span>Groups</span>

                <EditProductGroup v-model:open="editGroups.open" :product="product">
                    <Button variant="outline" size="sm">Manage Groups</Button>
                </EditProductGroup>
            </div>

            <div class="gap-3 grid grid-cols-2 p-5 py-3">
                <span>Tags</span>

                <span>{{ product.tags.length ? product.tags.split(',').join(', ') : '-' }}</span>
            </div>
        </div>

        <EditProductCategorization @updated="$emit('updated')" :groups="groups" v-model:open="editCategorization.open" :product="product" />
    </div>
</template>

<script>
import { getProductGroupsFromProduct } from '~/services/products';
import EditProductCategorization from './EditProductCategorization.vue';
import EditProductGroup from './EditProductGroup.vue';

export default {
    props: ['product'],
    emits: ['updated'],
    data() {
        return {
            editCategorization: {
                open: false
            },
            editGroups: {
                open: false
            },
            groups: []
        }
    },
    methods: {

    },
    components: {
        EditProductCategorization,
        EditProductGroup
    }
}
</script>
