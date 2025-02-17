<template>
    <div class=" w-full flex flex-col shadow overflow-hidden rounded-lg ">
        <div class="flex bg-white items-center gap-3 flex-row border rounded-t-lg p-3">
            <span class="text-lg font-medium">Order Summary</span>

            <div class="ml-auto">
                <button class="hover:bg-black/10 rounded-lg p-1 transition-all duration-400 ease-in-out">
                    <PhosphorIconDotsThree :size="24" />
                </button>
            </div>
        </div>

        <div class="flex flex-col bg-white divide-y border-x border-b runded-b-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Variant</TableHead>
                        <TableHead class="text-right">Price</TableHead>
                        <TableHead class="text-right">Quantity</TableHead>
                        <TableHead class="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow  class="cursor-pointer"
                        v-for="item in order.expand.orderItems" :key="item.id">
                        <TableCell class="font-medium">
                            <div class="flex flex-row items-center gap-2">
                                <NuxtLink :to="`/main/products/${item.product}`" class="text-primary underline font-medium">{{ item.name }}</NuxtLink>
                            </div>
                        </TableCell>
                        <TableCell>{{ item.expand?.variant.options.length > 0 ? item.expand?.variant?.expand?.options?.map((option) => option.value).join(' / ') : 'DEFAULT' }}</TableCell>
                        <TableCell class="text-right">{{  Intl.NumberFormat('currency', { style: 'currency', currency: 'UGX' }).format(item.price) }}</TableCell>
                        <TableCell class="text-right">x{{ item.quantity }}</TableCell>
                        <TableCell class="text-right">{{ Intl.NumberFormat('currency', { style: 'currency', currency: 'UGX' }).format(item.quantity * item.price) }}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <div class="flex flex-col w-full py-3 px-5">
                <div class="grid grid-cols-2 gap-3 text-black/70 text-sm">
                    <span>Items Total</span>

                    <div class="flex flex-row w-full justify-end">
                        <span class="text-right">{{ Intl.NumberFormat('currency', { style: 'currency', currency: 'UGX' }).format(itemsTotal) }}</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3 text-black/70 text-sm">
                    <span>Discount</span>

                    <div class="flex flex-row w-full justify-end">
                        <span class="text-right">- {{ Intl.NumberFormat('currency', { style: 'currency', currency: 'UGX' }).format(discount) }}</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3 text-black/70 text-sm">
                    <span>Total</span>

                    <div class="flex flex-row w-full justify-end">
                        <span class="text-right">{{ Intl.NumberFormat('currency', { style: 'currency', currency: 'UGX' }).format(total) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['order'],
    computed: {
        itemsTotal() {
            return this.order.expand.orderItems.reduce((total, item) => total + item.quantity * item.price, 0)
        },
        discount() {
            return 0;
        },
        total() {
            return this.itemsTotal - this.discount;
        }
    }
}
</script>