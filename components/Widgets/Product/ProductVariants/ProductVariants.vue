<template>
    <div class=" w-full flex flex-col shadow overflow-hidden rounded-lg ">
                    <div class="flex bg-white items-center gap-3 flex-row border rounded-t-lg px-5 py-3">
                        <span class="text-lg font-medium">Variants</span>

                        <button
                            class="hover:bg-black/10 ml-auto rounded-lg p-1 transition-all duration-400 ease-in-out">
                            <PhosphorIconDotsThree :size="24" />
                        </button>
                    </div>

                    <div class=" bg-white divide-y border-x border-b rounded-b-lg flex flex-col">
                        <div class="flex flex-row px-5 justify-between py-3">
                            <button class="px-4 p-1 border text-sm font-medium rounded shadow-sm">Add Filter</button>

                            <div class="flex flex-row items-center gap-2">
                                <div
                                    class="flex flex-row p-1 items-center bg-[#fafafa] text-sm border shadow hover:bg-black/5 rounded gap-1 text-black/50">
                                    <PhosphorIconMagnifyingGlass :size="18" />
                                    <input class="bg-transparent focus:outline-none placeholder:text-black/50"
                                        placeholder="Search" />
                                </div>

                                <button
                                    class="hover:bg-black/10 shadow bg-[#fafafa] border rounded p-1 transition-all duration-400 ease-in-out">
                                    <PhosphorIconSortAscending :size="18" />
                                </button>
                            </div>
                        </div>
                        <div class="flex flex-col w-full">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead class="w-[100px]">
                                            {{ options.map(opt => opt.name).join('/') }}
                                        </TableHead>
                                        <TableHead class="text-right">Cost</TableHead>
                                        <TableHead class="text-right">Price</TableHead>
                                        <TableHead class="text-right">Stock</TableHead>
                                        <TableHead>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="variant in product.expand.variants">
                                        <TableCell class="font-medium px-4 py-2">
                                            {{ product.hasVariants ? variant.expand?.options?.map(opt => opt.value).join(' / ') : 'DEFAULT' }}
                                        </TableCell>
                                        <TableCell class="text-right px-4 py-2">{{ variant.cost.toLocaleString('en-UG', {
                                            style:
                                            'currency', currency: 'UGX' }) }}</TableCell>
                                        <TableCell class="text-right px-4 py-2">{{ variant.price.toLocaleString('en-UG', {
                                            style:
                                            'currency', currency: 'UGX' }) }}</TableCell>
                                        <TableCell class="text-right px-4 py-2">{{ variant.stock.toLocaleString() }} items
                                        </TableCell>
                                        <TableCell class="text-right px-4 py-2">
                                            <button @click="openEditVariantDialog(variant)"
                                                class="hover:bg-black/10 ml-auto rounded-lg p-1 transition-all duration-400 ease-in-out">
                                                <PhosphorIconPencilSimple :size="18" />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        <div class="flex flex-row px-5 p-3">
                            <span class="text-black/50">Page 1 of 1</span>
                        </div>
                    </div>
                    <EditProductVariantDialog :product="product" @updated="$emit('updated')" v-model:open="dialogs.editVariant.open" :variant="dialogs.editVariant.variant" />
                </div>
</template>

<script>
import EditProductVariantDialog from './EditProductVariantDialog.vue';

export default {
    props: ['product'],
    emits: ['updated'],
    data() {
        return {
            dialogs: {
                editVariant: {
                    open: false,
                    variant: null
                }
            }
        }
    },
    computed: {
        options() {
            if (this.product && this.product.hasVariants) {
                const variantOptions = this.product.expand.variantOptions;
                const out = []
                for (let variant of variantOptions) {
                    const exists = out.find((opt) => opt.name === variant.name);

                    if (exists && !exists?.values?.includes(variant.value)) {
                        exists.values.push(variant.value)
                    } else {
                        out.push({ name: variant.name, values: [variant.value] });
                    }
                };

                return out;
            }

            return [{ name: 'DEFAULT' }];
        }
    },
    methods: {
        openEditVariantDialog(variant) {
            this.dialogs.editVariant = {
                open: true,
                variant: variant
            }
        }
    },
    components: {
        EditProductVariantDialog
    }
}
</script>