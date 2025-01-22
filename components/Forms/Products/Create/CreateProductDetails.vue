<template>
    <div class="flex flex-col w-full lg:w-1/2">

        <form @submit="onSubmit" class="flex flex-col gap-8">
            <!-- Product Name -->
            <FormField v-slot="{ componentField }" name="name">
                <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="e.g Jacket" v-bind="componentField" />
                    </FormControl>
                    <FormDescription>
                        This is the display name of the product.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField>

            <!-- Product Description -->
            <FormField v-slot="{ componentField }" name="description">
                <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="" v-bind="componentField" />
                    </FormControl>
                    <FormDescription>
                        Provide a detailed description of the product. This will help customers understand what the
                        product is and its features.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField>

            <!-- Product Media  -->
            <FormField v-slot="{ value }" name="media">
                <FormItem>
                    <FormLabel>Product Media</FormLabel>
                    <FormControl>
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
                            <div :key="index" v-for="file, index in value"
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
                    </FormControl>
                    <FormDescription>
                        Provide a detailed description of the product. This will help customers understand what the
                        product is and its features.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField>

            <!-- Has Variants? -->
            <FormField v-slot="{ componentField, value, handleChange }" name="hasVariants">
                <FormItem>
                    <FormLabel>Variants</FormLabel>
                    <FormControl>
                        <div class="flex flex-row p-5 gap-3 border shadow rounded-lg">
                            <Switch :checked="value" @update:checked="handleChange" />

                            <div class="flex flex-col gap-1">
                                <span class="font-medium">This is a product with variants</span>
                                <span class="text-sm text-black/80">When unchecked a default variant shall be created
                                    for you!</span>
                            </div>
                        </div>
                    </FormControl>

                    <FormMessage />
                </FormItem>
            </FormField>

            {{ form.values }}
            <!-- Variant Options -->
            <div v-if="form.values.hasVariants">
                <div class="flex flex-col gap-3">
                    <div class="flex flex-row items-center justify-between">
                        <div class="flex flex-col">
                            <span>Product Options</span>
                            <span class="text-black/80">Define the options for the product, e.g. color, size,
                                etc.</span>
                        </div>
                        <button type="button"
                            @click="form.setFieldValue('variantOptions', [...form.values.variantOptions, { name: '', values: [] }])"
                            class="text-white bg-primary text-sm px-4 p-1 rounded">Add</button>
                    </div>

                    <div class="flex flex-col gap-2">
                        <div v-for="option in form.values.variantOptions"
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
                            <button type="button" @click="form.setFieldValue('variantOptions', form.values.variantOptions.filter(opt => opt !== option))">
                                <PhosphorIconX :size="18" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <!-- Variants -->
            <FormField v-if="form.values.hasVariants" v-slot="{ value }" name="variants">
                <FormMessage />
                <VariantTable
                    v-if="form.values.variantOptions.filter((option) => option.name.length > 0 && option.values.length > 0).length > 0"
                    @update:selected="(val) => form.setFieldValue('variants', val)"
                    :variant-options="form.values.variantOptions.filter((option) => option.name.length > 0 && option.values.length > 0)" />
            </FormField>
        </form>

    </div>
</template>

<script setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod'
import VariantTable from './VariantTable.vue';

import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'


import * as z from 'zod';

const props = defineProps(['formValues']);
const emits = defineEmits(['update:formValues', 'complete']);

const selection = ref([])


const formSchema = toTypedSchema(z.object({
    name: z.string().min(2).max(50),
    description: z.string().max(500),
    media: z.array(z.instanceof(File)).default([]).optional(),
    hasVariants: z.boolean(),
    variantOptions: z.array(z.object({ name: z.string(), values: z.array(z.string()).max(50) })),
    variants: z.array(z.any()).min(1, 'Atleast 1 variant is required!').default([{ options: [], price: 0, stock: 0, allowBackOrder: false, manageInventory: false, media: [], thumb: null }]),
}));

const form = useForm({
    validationSchema: formSchema,
    initialValues: props.formValues,
});

function validateForm() {
    form.validate();
    if (form.meta.value.valid) {
        emits('update:formValues', form.values);
        emits('complete');
    }
}

function onSubmit(values) {
    console.log(values);
}

// Expose the `validateForm` method
defineExpose({
    validateForm,
    form
});

// file management
import { useDropZone } from '@vueuse/core'
import { useSortable } from '@vueuse/integrations/useSortable'

const dropZoneRef = ref();
const sortable = ref();
const media = computed({
    get() {
        return form.values.media;
    },
    set(value) {
        form.setFieldValue('media', value);
    }
});

useSortable(sortable, media, { animation: 150 });

function onDrop(files) {
    console.log(files);
    form.setFieldValue('media', [...form.values.media, ...files]);
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
    form.setFieldValue('media', form.values.media.filter((f) => f !== file));
    URL.revokeObjectURL(file);
}

</script>