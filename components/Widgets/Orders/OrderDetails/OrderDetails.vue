<template>
    <div class=" w-full flex flex-col bg-white shadow overflow-hidden rounded-lg ">
        <div class="flex bg-white items-center gap-3 flex-row border border-b-0 rounded-t-lg p-3">
            <span class="text-lg font-medium">Order Details</span>

            <div class="flex flex-row items-center gap-1 ml-auto">
                <AlertDialog v-if="order.orderStatus !== 'CANCELLED'">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <button class="hover:bg-black/10 rounded-lg p-1 transition-all duration-400 ease-in-out">
                                <PhosphorIconDotsThree :size="24" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <AlertDialogTrigger>
                                <DropdownMenuItem>
                                    <PhosphorIconXCircle />
                                    Cancel Order
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription >
                                This will cancel the order.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction @click="updateOrderStatus('CANCELLED')">Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog v-else>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <button class="hover:bg-black/10 rounded-lg p-1 transition-all duration-400 ease-in-out">
                                <PhosphorIconDotsThree :size="24" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <AlertDialogTrigger>
                                <DropdownMenuItem>
                                    <PhosphorIconArrowCounterClockwise />
                                    Undo Cancel Order
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription >
                                This will cancel the order.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction @click="updateOrderStatus('PENDING')">Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </div>

        <div v-if="order.orderStatus !== 'CANCELLED'" class="flex flex-col">
            <div class="flex flex-row w-full relative ">
                <div class="flex flex-row items-center px-5 justify-center w-full h-full absolute top-0 left-0">
                    <div class="h-1 hidden w-full bg-primary/10 flex flex-col">
                        <div class="h-full w-full bg-primary" :style="{ width: `${30 * (getStage(order) - 1)}%` }">
                        </div>
                    </div>
                </div>
                <div class="flex flex-col w-full items-center z-10">
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <button class="p-3 grid place-items-center bg-primary/10 rounded-full"
                                :class="{ '!bg-primary !text-white': getStage(order) >= 1 }">
                                <PhosphorIconMoney :size="24" />
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You are changing the status of this order to pending. Are you sure about this
                                    decision.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction @click="updateOrderStatus('PENDING')" :disabled="loading">
                                    <span v-if="!loading">Set to Pending</span>
                                    <PhosphorIconSpinner v-else :size="24" class="animate-spin" />
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <div class="flex flex-col w-full items-center z-10">
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <button class="p-3 grid place-items-center bg-primary/10 rounded-full"
                                :class="{ '!bg-primary !text-white': getStage(order) >= 2 }">
                                <PhosphorIconPackage :size="24" />
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You are changing the status of this order to packing. Are you sure about this
                                    decision.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction @click="updateOrderStatus('PACKING')" :disabled="loading">
                                    <span v-if="!loading">Set to packing</span>
                                    <PhosphorIconSpinner v-else :size="24" class="animate-spin" />
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>

                <div class="flex flex-col w-full items-center z-10">
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <button class="p-3 grid place-items-center bg-primary/10 rounded-full"
                                :class="{ '!bg-primary !text-white': getStage(order) >= 3 }">
                                <PhosphorIconVan :size="24" />
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You are changing the status of this order to Under Delivery. Are you sure about this
                                    decision.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction @click="updateOrderStatus('DELIVERY')" :disabled="loading">
                                    <span v-if="!loading">Set to Delivery</span>
                                    <PhosphorIconSpinner v-else :size="24" class="animate-spin" />
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>

                <div class="flex flex-col w-full items-center z-10">
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <button class="p-3 grid place-items-center bg-primary/10 rounded-full"
                                :class="{ '!bg-primary !text-white': getStage(order) >= 4 }">
                                <PhosphorIconCheckCircle :size="24" />
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You are changing the status of this order to complete. Are you sure about this
                                    decision.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction @click="updateOrderStatus('COMPLETED')" :disabled="loading">
                                    <span v-if="!loading">Completed Order</span>
                                    <PhosphorIconSpinner v-else :size="24" class="animate-spin" />
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>
            </div>
            <div class="flex flex-row w-full text-black/50">
                <div class="flex flex-col w-full items-center">
                    <span class="text-sm font-medium" :class="{ '!text-primary': getStage(order) >= 1 }">Payment</span>
                </div>

                <div class="flex flex-col w-full items-center">
                    <span class="text-sm font-medium" :class="{ '!text-primary': getStage(order) >= 2 }">Packing</span>
                </div>

                <div class="flex flex-col w-full items-center">
                    <span class="text-sm font-medium" :class="{ '!text-primary': getStage(order) >= 3 }">Delivery</span>
                </div>

                <div class="flex flex-col w-full items-center">
                    <span class="text-sm font-medium"
                        :class="{ '!text-primary': getStage(order) >= 4 }">Completed</span>
                </div>
            </div>
        </div>

        <div class="flex flex-col bg-white divide-y border-x border-b runded-b-lg">
            <div class="flex flex-row p-3 text-sm text-black/70">
                <span>Order #{{ order.orderNumber }} -- {{ new Date(order.created).toLocaleString('en-GB', {
                    day:
                        '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                }) }} from Default Sales Channel</span>
            </div>
        </div>
    </div>
</template>

<script>
import { updateOrder } from '@/services/orders';
import { toast } from 'vue-sonner';

export default {
    props: ['order'],
    emits: ['updated'],
    data() {
        return {
            loading: false
        }
    },
    methods: {
        getStage(order) {
            switch (order.orderStatus) {
                case 'PENDING':
                    return 1;
                case 'PACKING':
                    return 2;
                case 'DELIVERY':
                    return 3;
                case 'COMPLETED':
                    return 4;
                case 'CANCELLED':
                    return -1;
            }
        },

        async updateOrderStatus(status) {
            this.loading = true;

            try {
                const result = updateOrder(this.order.id, { orderStatus: status });

                toast.promise(result, {
                    loading: 'Updating Order Status ...',
                    success: () => {
                        this.$emit('updated');
                        return `Order status was updated successfully!`;
                    },
                    error: () => 'We were unable to update the order status at this time!',
                });

            } catch (e) {
                console.error(e);

                toast.error("Failed to update order!");
            }
            this.loading = false;

        }

    }
}
</script>