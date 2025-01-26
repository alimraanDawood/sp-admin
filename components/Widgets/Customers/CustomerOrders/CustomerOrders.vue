<template>
    <div class=" w-full flex flex-col shadow overflow-hidden rounded-lg ">
        <div class="flex bg-white items-center gap-3 flex-row border rounded-t-lg p-5">
            <span class="text-lg font-medium">Orders</span>

            <div class="ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <button class="hover:bg-black/10 rounded-lg p-1 transition-all duration-400 ease-in-out">
                            <PhosphorIconDotsThree :size="24" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem @click="$router.push(`/main/products/groups/${group.id}/products`)">
                            <PhosphorIconPlus :size="14" /> Add
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>

        <div class="flex flex-col bg-white divide-y border-x border-b runded-b-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead class="">
                            Order
                        </TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>
                            Order Total
                        </TableHead>
                        <TableHead>
                            Payment Status
                        </TableHead>
                        <TableHead>
                            Order Status
                        </TableHead>
                        <TableHead>
                            <!-- Actions -->
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow class="cursor-pointer" @click="$router.push(`/main/products/${product.id}`)"
                        v-for="order in customer.expand.orders">
                        <TableCell class="font-medium">
                            <div class="flex flex-row items-center gap-2">
                                
                                <span>#{{ order.id }}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            {{ order.expand.orderItems.map((order) => order.name).join(', ') }}
                        </TableCell>
                        <TableCell>{{ order.total }}</TableCell>
                        <TableCell>{{ order.paymentStatus }}</TableCell>
                        <TableCell class="capitalize">{{ order.orderStatus }}</TableCell>

                        <TableCell class="text-center">
                            <Dialog>
                                <DialogTrigger @click="e => e.stopPropagation()" as-child>
                                    <button class="p-1">
                                        <PhosphorIconTrash :size="20" />
                                    </button>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Are you sure you want to remove this order?</DialogTitle>
                                        <DialogDescription>This action cannot be reversed!</DialogDescription>
                                    </DialogHeader>

                                    <DialogFooter class="flex flex-row gap-2 justify-end">
                                        <DialogClose class="w-full"><button
                                                class="bg-[#fafafa] hover:bg-black/5 w-full px-4 p-1 rounded shadow border">Cancel</button>
                                        </DialogClose>
                                        <DialogClose class="w-full">
                                        
                                            <button @click="deleteOrderFromCustomer(order.id)"
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

import { updateCustomer } from '@/services/customers';
import { toast } from 'vue-sonner';
import { getFileUrl } from '@/services/utils';

export default {
    props: ['customer'],
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
        async deleteCustomerFromCustomer(orderId) {
            try {
                const result = await updateCustomer(this.customer.id, { 'orders-': [orderId] });

                if(result) {
                    toast.success('Successfully removed Order!');
                    this.$emit('updated');
                }
            } catch(e) {
                toast.error('Failed to remove order! Please try again');

            }
        }
    }
}

</script>