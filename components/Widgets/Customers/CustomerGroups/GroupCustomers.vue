<template>
    <div class="w-full flex flex-col shadow overflow-hidden rounded-lg">
        <div class="flex bg-white items-center gap-3 flex-row border rounded-t-lg p-5">
            <span class="text-lg font-medium">Customer Groups</span>

            <div class="ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <button class="hover:bg-black/10 rounded-lg p-1 transition-all duration-400 ease-in-out">
                            <PhosphorIconDotsThree :size="24" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem @click="$router.push(`/main/customers/groups/${group.id}/customers`)">
                            <PhosphorIconPlus :size="14" /> Add
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <div class="flex flex-col bg-white divide-y border-x border-b rounded-b-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><!-- Actions --></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow class="cursor-pointer" @click="$router.push(`/main/customers/${customer.id}`)"
                        v-for="customer in group.expand.customers" :key="customer.id">
                        <TableCell class="font-medium">
                            <div class="flex flex-row items-center gap-2">
                                <span>{{ customer.name }}</span>
                            </div>
                        </TableCell>
                        <TableCell>{{ customer.email }}</TableCell>
                        <TableCell>
                            <span>Ahoy</span>
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
                                        <DialogTitle>Are you sure you want to remove this customer?</DialogTitle>
                                        <DialogDescription>This action cannot be reversed!</DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter class="flex flex-row gap-2 justify-end">
                                        <DialogClose class="w-full">
                                            <button class="bg-[#fafafa] hover:bg-black/5 w-full px-4 p-1 rounded shadow border">Cancel</button>
                                        </DialogClose>
                                        <DialogClose class="w-full">
                                            <button @click="deleteCustomerFromGroup(customer.id)"
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
import { required } from '@vuelidate/validators';

import { updateCustomerGroup } from '@/services/customers';
import { toast } from 'vue-sonner';

export default {
    props: ['group'],
    emits: ['updated'],
    setup() {
        const v$ = useVuelidate();
        return { v$ };
    },
    data() {
        return {};
    },
    validations() {
        return {
            editForm: {
                values: {
                    name: { required },
                    cover: { required }
                }
            }
        };
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
        async deleteCustomerFromGroup(customerId) {
            try {
                const result = await updateCustomerGroup(this.group.id, { 'customers-': [customerId] });

                if (result) {
                    toast.success('Successfully removed customer!');
                    this.$emit('updated');
                }
            } catch (e) {
                toast.error('Failed to remove customer! Please try again');
            }
        }
    }
};
</script>
