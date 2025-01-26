<template>
    <div class=" w-full flex flex-col shadow overflow-hidden rounded-lg ">
        <div class="flex bg-white items-center gap-3 flex-row border rounded-t-lg p-5">
            
            <span class="text-lg font-medium">{{ customer.name }}</span>

            <div class="ml-auto">
                <Dialog>
                    <DropdownMenu :modal="false">
                        <DropdownMenuTrigger as-child>
                            <button class="hover:bg-black/10 rounded-lg p-1 transition-all duration-400 ease-in-out">
                                <PhosphorIconDotsThree :size="24" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem @click="openEditForm">
                                <PhosphorIconPencilSimple :size="14" /> Edit
                            </DropdownMenuItem>
                            <DialogTrigger as-child>
                                <DropdownMenuItem>
                                    <PhosphorIconTrashSimple :size="14" /> Delete
                                </DropdownMenuItem>
                            </DialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to delete this customer?</DialogTitle>
                            <DialogDescription>This action cannot be reversed!</DialogDescription>
                        </DialogHeader>

                        <DialogFooter class="flex flex-row gap-2 justify-end">
                            <DialogClose class="w-full"><button
                                    class="bg-[#fafafa] hover:bg-black/5 w-full px-4 p-1 rounded shadow border">Cancel</button>
                            </DialogClose>
                            <button @click="deleteCustomer"
                                class="bg-primary font-medium text-white w-full whitespace-nowrap px-4 p-1 rounded shadow">Delete</button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>

        <div class="flex flex-col bg-white divide-y border-x border-b runded-b-lg">
            <div class="gap-3 grid grid-cols-2 p-5 py-3">
                <span>Email</span>

                <span>{{ customer.email }}</span>
            </div>
        </div>

        <div class="flex flex-col bg-white divide-y border-x border-b runded-b-lg">
            <div class="gap-3 grid grid-cols-2 p-5 py-3">
                <span>Phone</span>

                <span>{{ customer.phone }}</span>
            </div>
        </div>
    </div>

    <EditCustomer ref="editForm" @updated="$emit('updated')" :customer="customer" v-model:isOpen="editForm.open" />
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

import { deleteCustomer } from '@/services/customers';
import { toast } from 'vue-sonner';
import { getFileUrl } from '@/services/utils';

import EditCustomer from '@/components/Widgets/Customers/EditCustomer/EditCustomer.vue';

export default {
    props: ['customer'],
    emits: ['updated'],
    setup() {
        const v$ = useVuelidate()
        return { v$ };
    },
    data() {
        return {
            editForm: {
                open: false,                
            }
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
        EditCustomer
    },
    methods: {
        getFileUrl,
        createObjectURL(file) {
            return URL.createObjectURL(file);
        },
        addImage() {
            // Logic to handle image upload
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (event) => {
                const file = event.target.files[0];
                if (file) {
                    this.editForm.values.cover = file;
                }
            };
            input.click();
        },
        openEditForm() {
            this.$refs.editForm.openEditForm();
        },

        closeEditForm() {
            this.editForm.values = {
                name: '',
                cover: null
            };

            this.editForm.saving = false;
            this.editForm.open = false;
        },

        async deleteCustomer() {
            try {
                const deleted = await deleteCustomer(this.customer.id);

                if (deleted) {
                    toast.success('Customer deleted successfully.');
                    this.$router.go(-1);
                }
            } catch (e) {
                console.error(e);

                toast.error('Failed to delete customer. Please try again.');
            }
        }
    }
}

</script>