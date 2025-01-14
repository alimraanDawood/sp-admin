<template>
    <Form :validation-schema="formSchema" v-slot="{ values }" 
        class="flex flex-col gap-5 md:w-[75vw] lg:w-[50vw] h-full w-full">
        <div class="flex flex-col gap-2">
            <FormField v-slot="{ componentField }" name="username">
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="Jacket" v-bind="componentField" />
                </FormControl>
    
                <FormDescription>
                    Your Product's display name
                </FormDescription>
                <FormMessage />
            </FormField>
        </div>

        <div class="flex flex-col gap-2">
            <FormField v-slot="{ componentField }" name="description">
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                    <Textarea class="border" v-bind="componentField" />
                </FormControl>
    
                <FormDescription>
                    Details about your product.
                </FormDescription>
                <FormMessage />
            </FormField>
        </div>

        <div class="flex flex-col gap-2">
            <FormField v-slot="{ value, handleChange }" name="hasVariants">
                <FormLabel>Variants</FormLabel>
                <FormControl>
                    <div class="p-3 border shadow rounded-lg w-full flex flex-row gap-2 items-center">
                        <Switch :checked="value" @update:checked="handleChange" />
                        <div class="flex flex-col">
                            <span class="font-medium">Yes, this is a product with variants</span>
                            <span class="text-sm text-black/70">When unchecked, a default variant will be created.</span>
                        </div>
                    </div>
                </FormControl>
            </FormField>
        </div>

        <div v-if="values.hasVariants" class="flex flex-col w-full gap-2">
            <div class="flex flex-col gap-1">
                <div class="flex flex-row w-full justify-between">
                    <span class="font-medium">Variant Options</span>
                    <button class="text-sm bg-primary text-white font-medium flex flex-row px-4 p-1 rounded">Add</button>
                </div>
                <span class="text-sm text-black/70">Define the options for your product variants e.g Size, Color.</span>
            </div>
            <div v-for="variant in variants" class="flex flex-row w-full border gap-3 items-start shadow rounded-lg p-3">
                <div class="flex flex-col gap-3 w-full">
                    <Input placeholder="Title e.g Colour" />
                    <TagsInput :model-value="variant.options">
                        <TagsInputItem class="bg-primary text-white font-medium" v-for="item in variant.options" :key="item" :value="item">
                            <TagsInputItemText />
                            <TagsInputItemDelete />
                        </TagsInputItem>

                        <TagsInputInput placeholder="Options e.g Red, Green, Blue " />
                    </TagsInput>
                </div>
                <button>
                    <PhosphorIconX :size="20" />
                </button>
            </div>
        </div>


    </Form>
</template>

<script setup lang="ts">

import { useDropZone } from '@vueuse/core'

import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';

import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { Textarea } from '~/components/ui/textarea';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';



const formSchema = toTypedSchema(z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
    hasVariants: z.boolean().optional(),
}))

const form = useForm({
    validationSchema: formSchema,
});

const variants = ref([{
    title: '',
    options: []
}])

const onSubmit = form.handleSubmit((values) => {
    console.log('Form submitted!', values)
});


</script>