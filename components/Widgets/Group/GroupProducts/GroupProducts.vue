<template>
    <div class=" w-full flex flex-col shadow overflow-hidden rounded-lg ">
        <div class="flex bg-white items-center gap-3 flex-row border rounded-t-lg p-5">
            <span class="text-lg font-medium">Products</span>

            <div class="ml-auto">
                <Button size="icon" @click="$router.push(`/main/products/groups/${group.id}/products`)">
                    <PhosphorIconPlus :size="14" />
                </Button>
            </div>
        </div>

        <div class="flex flex-col bg-white divide-y border-x border-b runded-b-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead class="">
                            Product
                        </TableHead>
                        <TableHead>Variants</TableHead>
                        <TableHead>
                            Status
                        </TableHead>
                        <TableHead>
                            <!-- Actions -->
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow class="cursor-pointer" @click="$router.push(`/main/products/${product.id}`)"
                        v-for="product in group.expand?.products">
                        <TableCell class="font-medium">
                            <div class="flex flex-row items-center gap-2">
                                <div class="aspect-square w-8 bg-primary rounded bg-center bg-cover"
                                    :style="{ backgroundImage: `url('${getFileUrl(product, product.thumb, { thumb: '50x50' })}')` }">
                                </div>

                                <span>{{ product.name }}</span>
                            </div>
                        </TableCell>
                        <TableCell>{{ product.variants.length }} variants</TableCell>
                        <TableCell>
                            <div class="flex flex-row gap-2 text-sm items-center">
                                <div class="bg-green-500 h-4 aspect-square rounded"></div>

                                <span>Published</span>
                            </div>
                        </TableCell>

                        <TableCell class="text-center">
                            <Dialog>
                                <DialogTrigger @click="e => e.stopPropagation()" as-child>
                                    <button class="p-1">
                                        <PhosphorIconTrash :size="20" />
                                    </button>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Are you sure you want to remove this product?</DialogTitle>
                                        <DialogDescription>This action cannot be reversed!</DialogDescription>
                                    </DialogHeader>

                                    <DialogFooter class="flex flex-row gap-2 justify-end">
                                        <DialogClose class="w-full"><button
                                                class="bg-[#fafafa] hover:bg-black/5 w-full px-4 p-1 rounded shadow border">Cancel</button>
                                        </DialogClose>
                                        <DialogClose class="w-full">
                                        
                                            <button @click="deleteProductFromGroup(product.id)"
                                                class="bg-primary font-medium text-white w-full whitespace-nowrap px-4 p-1 rounded shadow">Remove</button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </div>

</template>

<script>

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';


import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';

import { updateProductGroup, deleteProductGroup } from '@/services/products';
import { toast } from 'vue-sonner';
import { getFileUrl } from '@/services/utils';

export default {
    props: ['group'],
    emits: ['updated'],
    setup() {
        const v$ = useVuelidate()
        return { v$ };
    },
    data() {
        return {
        }
    },
    validations() {
        return {
            editForm: {
                values: {
                    name: { required },
                    cover: { required }
                }
            }
        }
    },
    components: {
        Sheet,
        SheetContent,
        SheetDescription,
        SheetHeader,
        SheetTitle,
        SheetTrigger,
    },
    methods: {
        getFileUrl,
        async deleteProductFromGroup(productId) {
            try {
                const result = await updateProductGroup(this.group.id, { 'products-': [productId] });

                if(result) {
                    toast.success('Successfully removed Products!');
                    this.$emit('updated');
                }
            } catch(e) {
                toast.error('Failed to remove product! Please try again');

            }
        }
    }
}

</script>