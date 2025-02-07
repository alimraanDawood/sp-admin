<template>
    <div class=" w-full flex flex-col shadow overflow-hidden rounded-lg ">
        <div class="flex bg-white items-center gap-3 flex-row border rounded-t-lg px-5 p-3">
            <span class="text-lg font-medium">Payment Details</span>

            <div class="ml-auto">
                <button class="hover:bg-black/10 rounded-lg p-1 transition-all duration-400 ease-in-out">
                    <PhosphorIconDotsThree :size="24" />
                </button>
            </div>
        </div>

        <div class="flex flex-col bg-white divide-y border-x border-b runded-b-lg">
            
            <div class="gap-3 flex flex-row w-full p-5 py-3">
                <div class="flex flex-col w-full text-left">
                    <span>Registered Name</span>
                </div>

                <div class="flex flex-col w-full text-right">
                    <div class="" >
                        {{ order.expand.paymentOption.registered_name }}
                    </div>
                </div>
            </div>

            <div class="gap-3 flex flex-row w-full p-5 py-3">
                <div class="flex flex-col w-full text-left">
                    <span>Phone</span>
                </div>

                <div class="flex flex-col w-full text-right">
                    <a :href="`TEL:${order.expand.paymentOption.phone}`" class="text-primary underline" target="_blank">
                        {{ order.expand.paymentOption.phone }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['order']
}
</script>