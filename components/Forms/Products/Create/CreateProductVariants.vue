<template>
    <div class="flex flex-col w-full">

        <form @submit="onSubmit" class="flex flex-col gap-8">
            <VariantDetails :variants="formValues.details.variants" @update:variants="(val) => console.log(val)" :options="formValues.details.variantOptions" />
        </form>

    </div>
</template>

<script setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import VariantDetails from './VariantDetails.vue';

import * as z from 'zod';

const props = defineProps(['formValues']);
const emits = defineEmits(['update:formValues','complete']);

const variants = computed({
    get() {
        return props.formValues.details.variants;
    },
    set(value) {
        console.log(value)
    }
})

const formSchema = toTypedSchema(z.object({
    variants: z.array(z.object({
        options: z.array(z.string()),
        price: z.number(),
        stock: z.number(),
        allowBackOrder: z.boolean(),
        manageInventory: z.boolean(),
        media: z.array(z.instanceof(File)).optional(),
        thumb: z.instanceof(File).optional()
    })).optional()
}));

const form = useForm({
    validationSchema: formSchema,
    initialValues: props.formValues,
});

function validateForm() {
    form.validate();
    if(form.meta.value.valid) {
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

</script>