<template>
    <div class=" w-full flex flex-col shadow overflow-hidden rounded-lg ">
        <div class="flex bg-white items-center gap-3 flex-row border rounded-t-lg p-5">
            <span class="text-lg font-medium">Customer</span>

            <div class="ml-auto">
                <button class="hover:bg-black/10 rounded-lg p-1 transition-all duration-400 ease-in-out">
                    <PhosphorIconDotsThree :size="24" />
                </button>
            </div>
        </div>

        <div class="flex flex-col bg-white divide-y border-x border-b runded-b-lg">
            <div class="gap-3 grid grid-cols-2 p-5 py-3">
                <span>Id</span>

                <button @click="$router.push(`/main/customers/${order.expand.customer.id}/`)" class="text-primary underline">{{ order.expand.customer.name }}</button>
            </div>

            <div class="gap-3 grid grid-cols-2 p-5 py-3">
                <span>Contact</span>

                <div class="flex flex-col p-3 w-full whitespace-wrap text-sm">
                    <span class="word">{{ order.expand.customer.email }}</span>
                    <span>{{ order.expand.customer.phone }}</span>
                </div>
            </div>

            <div class="gap-3 grid grid-cols-2 p-5 py-3">
                <span>Discountable</span>

                <span>Yes</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['order']
}
</script>