<template>
    <div class="flex flex-col w-full lg:w-1/2 gap-4">
        <span class="text-2xl font-medium">Categorization</span>
        <div class="flex flex-col gap-8">

            <div  name="groups">
                <div class="flex flex-col gap-3 w-full">
                    <div class="flex flex-row items-center justify-between">
                        <div class="flex flex-col">
                            <span class="font-medium">Groups</span>
                            <span class="text-black/80 text-sm">Specify the groups for the product</span>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                        <SelectGroup :groups="productStore.create.forms.categorization.groups" @update:group="(val) => productStore.create.forms.categorization.groups = val" />
                    </div>
                </div>
            </div>

            <div name="tags">
                <div class="flex flex-col gap-3 w-full">
                    <div class="flex flex-row items-center justify-between">
                        <div class="flex flex-col">
                            <span class="font-medium">Tags</span>
                            <span class="text-black/80 text-sm">Product tags help to categorize and filter products.</span>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                        <SelectTags :tags="productStore.create.forms.categorization.tags" @update:group="(val) => productStore.create.forms.categorization.tags = val" />
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>

<script setup>
import SelectGroup from './SelectGroup.vue';
import SelectTags from './SelectTags.vue';
import { useProductStore } from '@/stores/product';

const props = defineProps(['formValues']);
const emits = defineEmits(['update:formValues', 'complete']);

const productStore = useProductStore();

const rules = computed(() => {
    return {}
});

import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';

const v$ = useVuelidate(rules, productStore.create.forms.categorization);


defineExpose({
   validator: v$
})
</script>