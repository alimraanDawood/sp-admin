<template>
    <div class="flex flex-col w-full lg:w-1/2">
        <div class="flex flex-col gap-8">
            <span class="text-2xl font-semibold">General Details</span>
            <!-- Product Name -->
            <div class="flex flex-col w-full gap-2">
                <span class="font-medium">Product Name</span>
                <Input type="text" placeholder="e.g Jacket" v-model="v$.name.$model" />
                
                <div class="input-errors flex flex-col" v-for="error of v$.name.$errors" :key="error.$uid">
                    <div class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1"> <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}</div>
                </div>
                <span class="text-sm text-black/50">
                    This is the display name of the product.
                </span>
            </div>

            <!-- Product Description -->
            <div class="flex flex-col w-full gap-1">
                <span class="font-medium">Product Description</span>

                <Textarea placeholder="" v-model="productStore.create.forms.details.description" />
                <span class="text-sm text-black/50">
                    Provide a detailed description of the product. This will help customers understand what the
                    product is and its features.
                </span>
            </div>

            <!-- Product Media  -->
            <div class="flex flex-col w-full gap-1">
                <span class="font-medium">Product Media</span>

                <button type="button" @click="addMedia" ref="dropZoneRef"
                    class="w-full outline-2 outline-dashed rounded-lg p-5 items-center flex text-black/50 flex-col justify-center gap-1 hover:outline-blue-500"
                    :class="{ 'outline-blue-500 text-blue-500': isOverDropZone }">
                    <div class="flex flex-row gap-1 items-center font-semibold">
                        <PhosphorIconDownloadSimple :size="20" />

                        Upload Files
                    </div>
                    <span>Drag and drop images here or click to upload</span>
                </button>

                <div ref="sortable" class="flex flex-col gap-1">
                    <div :key="index" v-for="file, index in media"
                        class="flex flex-row items-center gap-3 p-2 border rounded-lg w-full shadow">
                        <button type="button" class="hover:cursor-grab active:cursor-grabbing">
                            <PhosphorIconDotsSixVertical :size="24" />
                        </button>

                        <div class="bg-primary w-12 aspect-square rounded bg-cover bg-center"
                            :style="{ backgroundImage: `url('${getURL(file)}')` }"></div>

                        <div class="flex flex-col w-full">
                            <span class="text-sm">{{ file.name }}</span>
                            <span class="text-xs">{{ formatFileSize(file.size) }}</span>
                        </div>

                        <div class="flex flex-row items-center gap-2">
                            <button type="button">
                                <PhosphorIconDotsThree :size="20" />
                            </button>

                            <button @click="deleteImage(file)" type="button">
                                <PhosphorIconX :size="20" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Has Variants? -->
            <div class="flex flex-col w-full gap-1">
                <span class="font-medium">Variants</span>
                <div class="flex flex-row p-5 gap-3 border shadow rounded-lg">
                    <Switch :checked="productStore.create.forms.details.hasVariants"
                        @update:checked="(val) => productStore.create.forms.details.hasVariants = val" />

                    <div class="flex flex-col gap-1">
                        <span class="font-medium">This is a product with variants</span>
                        <span class="text-sm text-black/80">When unchecked a default variant shall be created
                            for you!</span>
                    </div>
                </div>

            </div>

            <!-- Variant Options -->
            <div v-if="productStore.create.forms.details.hasVariants">
                <div class="flex flex-col gap-3">
                    <div class="flex flex-row items-center justify-between">
                        <div class="flex flex-col">
                            <span>Product Options</span>
                            <span class="text-black/80">Define the options for the product, e.g. color, size,
                                etc.</span>
                        </div>
                        <button type="button"
                            @click="v$.variantOptions.$model.push({ name: '', values: [] })"
                            class="text-white bg-primary text-sm px-4 p-1 rounded">Add</button>
                    </div>

                    <div class="input-errors flex flex-col" v-for="error of v$.variantOptions.$errors" :key="error.$uid">
                        <div class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1"> <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}</div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <div v-for="option in v$.variantOptions.$model"
                            class="border shadow w-full rounded-lg p-3 flex flex-row items-center gap-1">
                            <div class="flex flex-col gap-1 w-full">
                                <Input type="text" v-model="option.name" placeholder="Property name e.g color" />

                                <TagsInput :model-value="option.values"
                                    @update:model-value="(val) => option.values = val">
                                    <TagsInputItem class="bg-primary text-white" v-for="item in option.values"
                                        :key="item" :value="item">
                                        <TagsInputItemText />
                                        <TagsInputItemDelete
                                            @click="option.values.splice(option.values.indexOf(item))" />
                                    </TagsInputItem>

                                    <TagsInputInput
                                        :placeholder="option.values.length ? 'Enter option' : 'Red, Green, Blue (use commas to seperate)'" />
                                </TagsInput>
                            </div>
                            <button type="button"
                                @click=" v$.variantOptions.$model = v$.variantOptions.$model.filter(opt => opt !== option)">
                                <PhosphorIconX :size="18" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Variants -->
            <div v-if="productStore.create.forms.details.hasVariants && productStore.create.forms.details.variantOptions.filter((option) => option.name.length > 0 && option.values.length > 0).length > 0" class="flex flex-col gap-2">
                <div class="flex flex-col">
                    <span class="font-medium">Product Variants</span>
                </div>
                <div class="input-errors flex flex-col" v-for="error of v$.variants.$errors" :key="error.$uid">
                    <div class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1"> <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}</div>
                </div>
                <VariantTable
                    
                    @update:selected="(val) => v$.variants.$model = val"
                    :variant-options="productStore.create.forms.details.variantOptions.filter((option) => option.name.length > 0 && option.values.length > 0)" />
            </div>
        </div>

    </div>
</template>

<script setup>
import VariantTable from './VariantTable.vue';
import { useProductStore } from '@/stores/product';

const props = defineProps(['formValues']);
const emits = defineEmits(['update:formValues', 'complete']);
const productStore = useProductStore();



// file management
import { useDropZone } from '@vueuse/core'
import { useSortable } from '@vueuse/integrations/useSortable'

const dropZoneRef = ref();
const sortable = ref();
const media = computed({
    get() {
        return productStore.create.forms.details.media;
    },
    set(value) {
        productStore.create.forms.details.media = value;
    }
});

useSortable(sortable, media, { animation: 150 });

function onDrop(files) {
    console.log(files);
    media.value = [...media.value, ...files];
    // called when files are dropped on zone
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop,
    // specify the types of data to be received.
    dataTypes: ['image/jpeg'],
    // control multi-file drop
    multiple: true,
    // whether to prevent default behavior for unhandled events
    preventDefaultForUnhandled: false,
})

function addMedia() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg';
    input.multiple = true;
    input.onchange = (event) => {
        const files = Array.from(event.target.files);
        onDrop(files);
    };
    input.click();
}

function formatFileSize(size) {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

function getURL(file) {
    return URL.createObjectURL(file);
}

function deleteImage(file) {
    media.value = media.value.filter((f) => f !== file);
    URL.revokeObjectURL(file);
}

// Validation

import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';

const rules = computed(() => {
    return {
        name: {
            required: helpers.withMessage('Please enter a product name', required),
        },
        variantOptions: productStore.create.forms.details.hasVariants ? { required: helpers.withMessage('Atleast one option is required to create a variant!', required) } : {},
        variants: productStore.create.forms.details.hasVariants ? { required: helpers.withMessage('Please select atleast 1 variant!', required), minLength: minLength(1) } : {}
    }
})

const v$ = useVuelidate(rules, productStore.create.forms.details);

defineExpose({
    validator: v$
})

</script>