<template>
    <div class="flex gap-1 flex-col w-full h-full items-center justify-center">
        <div
            class="flex flex-col items-center justify-center w-full md:[w-75vw] lg:w-[50vw] xl:w-[35vw] border p-3 shadow rounded-lg gap-3">
            <div class="flex flex-col" :class="{ 'animate-pulse': loading }">
                <PhosphorIconCloudArrowUp class="text-black/30" :size="128" />
                <span class="font-semibold text-lg text-black/50">{{ loading ? 'Uploading Product' : 'Upload Product'}}</span>
            </div>

            <button @click="upload" :disabled='loading'
                class="w-full disabled:opacity-50 p-2 rounded px-6 font-semibold text-white bg-primary flex flex-row items-center justify-center">
                <span v-if="loading === false">Upload</span>
                <PhosphorIconSpinner v-else :size="24" class="animate-spin" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { useProductStore } from '@/stores/product';
import { toast } from 'vue-sonner'

const productStore = useProductStore();
const emit = defineEmits(['uploadStarted', 'uploadFinished']);
const loading = ref(false);

const $router = useRouter();

async function upload() {
    try {
        emit('uploadStarted', true);
        loading.value = true;

        const product = await productStore.createProduct();

        if (product) {
            toast('Product was successfully added!', {
                description: 'Sunday, December 03, 2023 at 9:00 AM',
            });

            productStore.resetCreateForms();

            $router.push('/main/products/');

        }

    } catch (e) {
        throw (e);
        emit('uploadFinished', false);
        loading.value = false;
    } finally {
        emit('uploadFinished', false);
        loading.value = false;
    }
}


const checkList = {
    current: 0,
    checklist: [
        'Verifying Product Data and Fields',
        'Creating Variant Options',
        'Creating Variants',
        'Uploading Media',
        'Creating Product',
        'Done'
    ]
}

import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';

const rules = {
    // product details
    name: {
        required
    },

}

// todo
// first validate all the fields to make sure we can proceed
// do we have all variants, and variant options
// check the files we need to upload
// etc etc etc
</script>