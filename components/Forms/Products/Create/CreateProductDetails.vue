<template>
    <Form :validation-schema="formSchema" v-slot="{ values }"
        class="flex flex-col gap-5 md:w-[75vw] lg:w-[50vw] h-full w-full py-5">
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

        <!-- Add Media -->
        <div class="flex flex-col gap-2">
            <button @click="chooseFiles" v-wave ref="dropZoneRef"
                class="flex flex-col w-full border rounded-lg p-3 items-center justify-center border-primary bg-primary/5 text-primary">
                <div v-if="!isOverDropZone" class="flex flex-col gap-1 text-center">
                    <div class="flex flex-row gap-2">
                        <PhosphorIconUploadSimple :size="20" />
                        <span>Upload Images</span>
                    </div>
                    <span class="text-primary/70 text-sm">Drag and drop images or click to upload.</span>
                </div>

                <div v-else class="flex flex-col">
                    <PhosphorIconFilePlus :size="44" />
                </div>
            </button>

            <div class="flex flex-col w-full gap-1 rounded-lg">
                <div v-for="image, index in image_links"
                    class="flex flex-row p-1 gap-3 aspect-square h-16 border border-primary/60 rounded items-center">
                    <button class="p-1">
                        <PhosphorIconDotsSixVertical :size="20" />
                    </button>

                    <div class="h-full bg-black aspect-square rounded bg-center bg-cover"
                        :style="{ backgroundImage: `url('${image}')` }"></div>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <PhosphorIconImage v-if="thumb === null ? (index === 0) : (thumb === image)" :size="20"
                                    weight="fill" class="text-primary" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Default Thumbnail</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>


                    <div class="flex flex-row text-black/50 ml-auto ">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <button class="p-2">
                                    <PhosphorIconDotsThree weight="bold" :size="20" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <button @click="makeThumb(image)" class="flex flex-row gap-1 items-center">
                                        <PhosphorIconImage :size="18" />

                                        <span>Make thumbnail</span>
                                    </button>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <button @click="deleteImage(index)" class="flex flex-row gap-1 items-center">
                                        <PhosphorIconTrash :size="18" />

                                        <span>Delete Image</span>
                                    </button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>


                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <button @click="deleteImage(index)" class="p-2">
                                        <PhosphorIconX weight="bold" :size="20" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete Image</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-2">
            <FormField v-slot="{ value, handleChange }" name="hasVariants">
                <FormLabel>Variants</FormLabel>
                <FormControl>
                    <div class="p-3 border shadow rounded-lg w-full flex flex-row gap-2 items-center">
                        <Switch :checked="value" @update:checked="handleChange" />
                        <div class="flex flex-col">
                            <span class="font-medium">Yes, this is a product with variants</span>
                            <span class="text-sm text-black/70">When unchecked, a default variant will be
                                created.</span>
                        </div>
                    </div>
                </FormControl>
            </FormField>
        </div>

        <div v-if="values.hasVariants" class="flex flex-col w-full gap-2">
            <div class="flex flex-col gap-1">
                <div class="flex flex-row w-full justify-between">
                    <span class="font-medium">Variant Options</span>
                    <button @click="addVariantOption"
                        class="text-sm bg-primary text-white font-medium flex flex-row px-4 p-1 rounded">Add</button>
                </div>
                <span class="text-sm text-black/70">Define the options for your product variants e.g Size, Color.</span>
            </div>
            <div v-for="variant, index  in variants"
                class="flex flex-row w-full border gap-3 items-start shadow rounded-lg p-3">
                <div class="flex flex-col gap-3 w-full">
                    <Input placeholder="Title e.g Colour" />
                    <TagsInput :model-value="variant.options">
                        <TagsInputItem class="bg-primary text-white font-medium" v-for="item in variant.options"
                            :key="item" :value="item">
                            <TagsInputItemText />
                            <TagsInputItemDelete />
                        </TagsInputItem>

                        <TagsInputInput placeholder="Options e.g Red, Green, Blue " />
                    </TagsInput>
                </div>
                <button  @click="deleteVariantOption(index)">
                    <PhosphorIconX :size="20" />
                </button>
            </div>
        </div>

        <!-- TODO: Add Variant Table -->

    </Form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'

import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { Textarea } from '~/components/ui/textarea';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const formSchema = toTypedSchema(z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
    hasVariants: z.boolean().optional(),
    files: z.array(z.instanceof(File))
}))

const form = useForm({
    validationSchema: formSchema,
});


const dropZoneRef = ref<HTMLButtonElement>();
const images = ref<File[]>([]);
const image_links = ref<String[]>([]);
const thumb = ref<File | null>(null);


function chooseFiles() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files) {
            onDrop(Array.from(target.files));
        }
    };
    input.click();
}

function makeThumb(image: File) {
    thumb.value = image;
}

function onDrop(files: File[] | null) {
    // called when files are dropped on zone
    if (files) {
        images.value = images.value.concat(files);
        console.log(images)
        image_links.value = getUrls(images.value);
    }
}

function getUrls(files: File[]) {
    return files.map((file: File) => URL.createObjectURL(file));
}

function deleteImage(index: number) {
    images.value.splice(index, 1);
    image_links.value = getUrls(images.value);
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop,
    // specify the types of data to be received.
    dataTypes: ['image/jpeg'],
    // control multi-file drop
    multiple: true,
    // whether to prevent default behavior for unhandled events
    preventDefaultForUnhandled: false,
});



const onSubmit = form.handleSubmit((values) => {
    console.log('Form submitted!', values)
});


const variants = ref([{
    title: '',
    options: []
}])

function addVariantOption() {
    variants.value.push({ title: '', options: [] });
}

function deleteVariantOption(index) {
    variants.value.splice(index, 1);
}

</script>