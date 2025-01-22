<template>
    <div class="flex flex-col w-full lg:w-1/2">

        <form @submit="onSubmit" class="flex flex-col gap-8">

            <FormField v-slot="{ value, handleChange }" name="groups">
                <FormItem>
                    <FormControl>
                        <div class="flex flex-col gap-3 w-full">
                            <div class="flex flex-row items-center justify-between">
                                <div class="flex flex-col">
                                    <FormLabel>Groups</FormLabel>
                                    <span class="text-black/80">Specify the groups for the product</span>
                                </div>
                            </div>

                            <div class="flex flex-col gap-2 w-full">
                                <SelectGroup :groups="value" @update:group="handleChange" />
                            </div>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ value, handleChange }" name="tags">
                <FormItem>
                    <FormControl>
                        <div class="flex flex-col gap-3 w-full">
                            <div class="flex flex-row items-center justify-between">
                                <div class="flex flex-col">
                                    <FormLabel>Tags</FormLabel>
                                    <span class="text-black/80">Product tags help to categorize and filter products.</span>
                                </div>
                            </div>

                            <div class="flex flex-col gap-2 w-full">
                                <SelectTags :tags="value" @update:group="handleChange" />
                            </div>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

        </form>

    </div>
</template>

<script setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod';


import SelectGroup from './SelectGroup.vue';
import SelectTags from './SelectTags.vue';



const props = defineProps(['formValues']);
const emits = defineEmits(['update:formValues', 'complete']);

// for groups input


const filteredGroups = computed(() => {
    return groups;
})

const formSchema = toTypedSchema(z.object({
    groups: z.array(z.object({ id: z.string(), name: z.string() })),
    tags: z.array(z.object({ id: z.string(), name: z.string() })),
}));

const form = useForm({
    validationSchema: formSchema,
    initialValues: props.formValues,
});

onMounted(() => {
     form.setValues(props.formValues);
})

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

</script>