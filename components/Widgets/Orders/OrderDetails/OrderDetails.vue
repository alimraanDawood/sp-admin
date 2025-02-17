<template>
    <div class=" w-full flex flex-col shadow overflow-hidden rounded-lg ">
        <div class="flex bg-white items-center gap-3 flex-row border border-b-0 rounded-t-lg p-3">
            <span class="text-lg font-medium">Order Details</span>

            <div class="flex flex-row items-center gap-1 ml-auto">
                <div class="border px-4 p-1 text-xs rounded">
                    Payment - 
                    {{ order.paymentStatus }}
                </div>

                <div class="border px-4 p-1 text-xs rounded">
                    Order - 
                    {{ order.orderStatus }}
                </div>
                <button class="hover:bg-black/10 rounded-lg p-1 transition-all duration-400 ease-in-out">
                    <PhosphorIconDotsThree :size="24" />
                </button>
            </div>
        </div>

        <div class="flex flex-col bg-white divide-y border-x border-b runded-b-lg">
            <div class="flex flex-row p-3 text-sm text-black/70">
                <span>Order #{{order.orderNumber}} -- {{ new Date(order.created).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) }} from Default Sales Channel</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['order']
}
</script>