<template>
    <div class="flex flex-col h-[100dvh] overflow-hidden w-full bg-primary p-3">
        <div class="bg-white flex flex-col h-full w-full rounded-lg overflow-hidden">
            <!-- Form Header -->
            <div class="flex flex-col gap-3 p-3 border-b shadow-sm">
                <div class="flex flex-row w-full justify-between items-center">
                    <span class="text-lg font-medium">Create Product</span>

                    <button class="grid place-items-center p-3 text-primary bg-primary/20 rounded-full">
                        <PhosphorIconX :size="20" />
                    </button>
                </div>
            </div>

            <!-- Form Body -->
            <div class="flex flex-col h-full w-full p-3 items-center justify-center overflow-y-scroll">
                <XyzTransition mode="out-in" xyz="fade">
                    <CreateProductDetails v-if="currentTab === 'details'" />
                    <CreateProductOrganization v-else-if="currentTab === 'organization'" />
                </XyzTransition>
            </div>

            <!-- Form Footer -->
            <div class="flex flex-row w-full p-3 items-center border-t shadow-sm">
                <span class="text-black/50 lg:hidden">Step 1 of 4</span>

                <div class="hidden lg:flex flex-row gap-2">
                    <button v-wave class="flex flex-row items-center gap-1 text-sm b px-4 p-2 rounded-full text-primary/60 hover:bg-primary/20 hover:text-primary/70 transition-all duration-300 bg-primary/10" :class="{ '!bg-primary text-white hover:text-white' : currentTab === 'details' }" @click="switchTab('details')">
                        1. Product Details
                    </button>

                    <button v-wave class="flex flex-row items-center gap-1 text-sm px-4 p-2 rounded-full text-primary/60 hover:bg-primary/20 hover:text-primary/70 transition-all duration-300 bg-primary/10" :class="{ '!bg-primary text-white hover:text-white' : currentTab === 'organization' }" @click="switchTab('organization')">
                        2. Organize
                    </button>

                    <button v-wave class="flex flex-row items-center gap-1 text-sm px-4 p-2 rounded-full text-primary/60 hover:bg-primary/20 hover:text-primary/70 transition-all duration-300 bg-primary/10" :class="{ '!bg-primary text-white hover:text-white' : currentTab === 'variants' }" @click="switchTab('variants')">
                        3. Product Variants
                    </button>
                </div>
                <div class="flex flex-row gap-2 items-center ml-auto">
                    <button v-wave class="px-4 p-2 rounded-lg bg-primary/30 text-primary font-medium">Cancel</button>
                    <button v-wave class="px-4 p-2 rounded-lg bg-primary text-white font-medium">Next</button>
                    <button v-wave class="px-4 p-2 rounded-lg bg-primary text-white font-medium">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
definePageMeta({
});

import CreateProductDetails from '~/components/Forms/Products/Create/CreateProductDetails.vue';
import CreateProductOrganization from '~/components/Forms/Products/Create/CreateProductOrganization.vue';

export default {
    data() {
        return {
            currentTab: 'details' // details | organizaton | variants 
        }
    },
    methods: {
        switchTab(newTab) {
            this.currentTab = newTab;
        }
    },
    components: {
        CreateProductDetails,
        CreateProductOrganization
    }
}
</script>