<template>
    <div class=" w-full flex flex-col bg-white shadow overflow-hidden rounded-lg ">
        <div class="flex bg-white items-center gap-3 flex-row border border-b-0 rounded-t-lg p-3">
            <span class="text-lg font-medium">Order Delivery</span>

            <div class="ml-auto">
                <EditDelivery :delivery="order.expand.delivery" @updated="$emit('updated')">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <button class="p-2">
                                <PhosphorIconDotsThree size="24" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DialogTrigger>
                                <DropdownMenuItem>
                                    <PhosphorIconPencilSimple />
                                    Edit
                                </DropdownMenuItem>
                            </DialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </EditDelivery>

                <AlertDialog>
                    <AlertDialogTrigger>
                        <button class="p-2">
                            <PhosphorIconTrashSimple :size="24" />
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will remove the delivery details from this order
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction @click="deleteDelivery">Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>

        <div v-if="order.delivery" class="flex flex-col bg-white divide-y border-x border-b runded-b-lg">
            <div class="gap-3 grid grid-cols-2 p-5 py-3">
                <span>Location</span>

                <span class="text-right">{{ order.expand.delivery.location }}</span>
            </div>

            <div class="gap-3 flex flex-row w-full p-5 py-3">
                <div class="flex flex-col w-full text-left">
                    <span>Courier</span>
                </div>

                <div class="flex flex-col w-full text-right">
                    <a class="underline text-primary">
                        {{ order.expand.delivery?.expand?.courier?.name }}
                    </a>
                    <a :href="`TEL:${order.expand?.delivery?.expand?.courier?.phone}`" class="underline text-primary">
                        {{ order.expand?.delivery?.expand?.courier?.phone }}
                    </a>
                </div>
            </div>
        </div>

        <div class="flex flex-col p-3" v-else>
            <CreateDelivery @created="setDelivery">
                <button
                    class="flex flex-row disabled:animate-pulse px-4 bg-primary/10 border border-primary rounded gap-2 text-sm border font-medium text-primary p-1 w-fit">
                    Assign a courier
                </button>
            </CreateDelivery>
        </div>
    </div>
</template>

<script>

import { getFullCouriers, deleteDelivery, updateOrder } from '@/services/orders';

import CreateDelivery from '@/components/Widgets/Delivery/CreateDelivery.vue';
import EditDelivery from '@/components/Widgets/Delivery/EditDelivery.vue';

export default {
    props: ['order'],
    emits: ['updated'],
    data() {
        return {
            couriers: []
        }
    },
    async mounted() {
        try {
            this.couriers = await getFullCouriers();
        } catch (e) {
            console.error(e)
        }
    },
    components: {
        CreateDelivery,
        EditDelivery
    },
    methods: {
        async setDelivery(delivery) {
            try {
                const result = await updateOrder(this.order.id, { delivery: delivery.id });

                this.$emit('updated', true);
            } catch (e) {
                console.error(e);
            }
        },
        async deleteDelivery() {
            try {
                // const result = await updateOrder(this.order.id, { delivery: null });
                const deleteResult = await deleteDelivery(this.order.delivery);

                this.$emit('updated', true);
            } catch (e) {
                console.error(e);
            }
        }
    }

}
</script>