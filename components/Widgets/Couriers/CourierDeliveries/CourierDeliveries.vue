<template>
    <div class="w-full flex flex-col shadow overflow-hidden rounded-lg">
        <div class="flex bg-white items-center gap-3 flex-row border rounded-t-lg p-5">
            <span class="text-lg font-medium">Deliveries</span>

            <div class="ml-auto">
                
            </div>
        </div>

        <div class="flex flex-col bg-white divide-y border-x border-b rounded-b-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead><!-- Actions --></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow class="cursor-pointer" 
                        v-for="delivery in page" :key="delivery.id">
                        <TableCell class="font-medium">{{ delivery.location }}</TableCell>
                        <TableCell>{{ delivery.cost }}</TableCell>
                        <TableCell>{{ delivery.order }}</TableCell>
                        <TableCell class="text-center">
                            <Dialog>
                                <DialogTrigger @click="e => e.stopPropagation()" as-child>
                                    <button class="p-1">
                                        <PhosphorIconTrash :size="20" />
                                    </button>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Are you sure you want to remove this delivery?</DialogTitle>
                                        <DialogDescription>This action cannot be reversed!</DialogDescription>
                                    </DialogHeader>

                                    <DialogFooter class="flex flex-row gap-2 justify-end">
                                        <DialogClose class="w-full">
                                            <button class="bg-[#fafafa] hover:bg-black/5 w-full px-4 p-1 rounded shadow border">Cancel</button>
                                        </DialogClose>
                                        <DialogClose class="w-full">
                                            <button @click="deleteDelivery(delivery.id)"
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

import { getCourierDeliveries, updateCourier, updateDelivery } from '@/services/orders';
import { toast } from 'vue-sonner';
import { getFileUrl } from '@/services/utils';

export default {
    props: ['courier'],
    emits: ['updated'],
    setup() {
        const v$ = useVuelidate();
        return { v$ };
    },
    data() {
        return {
            page: null
        };
    },
    async mounted() {
        try {
            this.page = await getCourierDeliveries(this.courier.id);
        } catch (e) {
            console.error(e);
        }
    },
    validations() {
        return {
            editForm: {
                values: {
                    location: { required },
                    cost: { required },
                    order: { required }
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
        getFileUrl,
        async deleteDelivery(deliveryId) {
            try {
                const result = await updateDelivery(deliveryId, { courier: null });

                if (result) {
                    toast.success('Successfully removed Delivery!');
                    this.$emit('updated');
                }

            } catch (e) {
                toast.error('Failed to remove delivery! Please try again');
            }
        }
    }
};
</script>
