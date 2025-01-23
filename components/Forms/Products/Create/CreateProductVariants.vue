<template>
    <div class="flex flex-col w-full gap-4">
        <span class="text-2xl font-medium">Variants</span>
        <VariantDetails />
    </div>
</template>

<script setup>
import VariantDetails from './VariantDetails.vue';


import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';

import { useProductStore } from '~/stores/product';

const productStore = useProductStore();

const rules = computed(() => {
    return {        
    }
})

const v$ = useVuelidate(rules, productStore.create.forms.variants);

defineExpose({
    validator: v$
})


</script>