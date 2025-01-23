<template>
    <div class=" w-full flex flex-col shadow overflow-hidden rounded-lg ">
        <div class="flex bg-white items-center gap-3 flex-row border rounded-t-lg p-5">
            <span class="text-lg font-medium">{{ product.name }}</span>

            <div class="flex flex-row">
                <div class="flex flex-row bg-black/5 p-1 pr-5 rounded gap-1 text-sm items-center">
                    <div class="bg-green-500 h-4 aspect-square rounded"></div>

                    <span>Published</span>
                </div>
            </div>
            <div class="ml-auto">
                <Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <button class="hover:bg-black/10 rounded-lg p-1 transition-all duration-400 ease-in-out">
                                <PhosphorIconDotsThree :size="24" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                                <DropdownMenuItem @click="openEditForm"><PhosphorIconPencilSimple :size="14" /> Edit</DropdownMenuItem>
                                <DialogTrigger as-child>
                                    <DropdownMenuItem><PhosphorIconTrashSimple :size="14" /> Delete</DropdownMenuItem>
                                </DialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
                            <DialogDescription>This action cannot be reversed!</DialogDescription>
                        </DialogHeader>

                        <DialogFooter class="flex flex-row gap-2 justify-end">
                            <DialogClose class="w-full"><button class="bg-[#fafafa] hover:bg-black/5 w-full px-4 p-1 rounded shadow border">Cancel</button></DialogClose>
                            <button @click="deleteProduct" class="bg-primary font-medium text-white w-full whitespace-nowrap px-4 p-1 rounded shadow">Delete</button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>

        <div class="flex flex-col bg-white divide-y border-x border-b runded-b-lg">
            <div class="gap-3 grid grid-cols-2 p-5 py-3">
                <span>Description</span>

                <span>{{ product.description }}</span>
            </div>

            <div class="gap-3 grid grid-cols-2 p-5 py-3">
                <span>Subtitle</span>

                <span>-</span>
            </div>

            <div class="gap-3 grid grid-cols-2 p-5 py-3">
                <span>Discountable</span>

                <span>Yes</span>
            </div>
        </div>
    </div>

    <!-- Edit Form -->
    <Sheet v-model:open="editForm.open">
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Edit Product</SheetTitle>
            </SheetHeader>

            <div class="flex flex-col w-full gap-5 p-3">
                <div class="flex flex-col gap-1">
                    <span>Product Name</span>
                    <Input v-model="v$.editForm.values.name.$model" />
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.editForm.values.name.$errors" :key="error.$uid">
                        <div class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1"> <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}</div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span>Product Description</span>
                    <Textarea rows="10" v-model="editForm.values.description" />
                </div>

                <div class="flex flex-row gap-2 justify-end">
                    <button :disabled="editForm.saving" @click="closeEditForm" class="disabled:opacity-50 border px-4 p-1 text-sm font-medium bg-[#fafafa] rounded text-black/70">Cancel</button>
                    <button :disabled="editForm.saving" @click="saveProductDetails" class="disabled:opacity-50 px-4 p-1 text-sm font-medium bg-primary rounded text-white">
                        <PhosphorIconSpinner v-if="editForm.saving" class="animate-spin" />
                        <span v-else>Save</span>
                    </button>
                </div>
            </div>
        </SheetContent>
    </Sheet>
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

import { updateProduct, deleteProduct } from '@/services/products';
import { toast } from 'vue-sonner';

export default {
    props: ['product'],
    emits: ['updated'],
    setup() {
        const v$ = useVuelidate()
        return { v$ };
    },
    data() {
        return {
            editForm: {
                open: false,
                values: {
                    name: '',
                    description: ''
                },
                saving: false
            }
        }
    },
    validations () {
        return {
            editForm: {
                values: {
                    name: { required }
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
        openEditForm() {
            this.editForm.values = {
                name: this.product.name,
                description: this.product.description
            }
            this.editForm.open = true;
        },
        closeEditForm() {
            this.editForm.values = {
                name: '',
                description: ''
            };

            this.editForm.saving = false;
            this.editForm.open = false;
        },
        async saveProductDetails() {
            this.v$.$validate()
            if(this.v$.$errors.length === 0) {
                try {
                    this.editForm.saving = true;
                    const product = await updateProduct(this.product.id, this.editForm.values);
                    this.$emit('updated');
                    toast.success('Product Details updated successfully.');
                    this.closeEditForm();
                } catch(e) {
                    console.error(e);

                    toast.error('Failed to update product. Please try again.');
                }
            }
        },

        async deleteProduct() {
            try {
                const deleted  = await deleteProduct(this.product.id);

                if(deleted) {
                    toast.success('Product Details deleted successfully.');
                    this.$router.go(-1);
                }
            } catch (e) {
                console.error(e);

                toast.error('Failed to delete product. Please try again.');
            }
        }
    }
}
</script>