<template>
    <div class="flex flex-col w-full h-[100dvh] p-3 bg-black/20 overflow-hidden">
        <div v-if="products !== null" class="flex flex-col w-full h-full rounded-lg bg-white border shadow">
            <div class="flex flex-row w-full border-b items-center">
                <Dialog>
                    <DialogTrigger>
                        <button :disabled="lock" class="flex flex-row items-center gap-3 p-3">
                            <PhosphorIconX :size="18" />

                            <span class="bg-black/5 border text-black/50 px-2 p-1 text-sm shadow rounded">esc</span>
                        </button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader class="text-left">
                            <DialogTitle>Are you sure you want to leave this form?</DialogTitle>
                            <DialogDescription>You have unsaved changes that will be lost if you exit this form.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter class="flex flex-row gap-2 justify-end">
                            <DialogClose class="w-full lg:w-fit"><button
                                    class="bg-[#fafafa] hover:bg-black/5 w-full md:w-fit px-4 p-1 rounded shadow border">Cancel</button>
                            </DialogClose>
                            <button @click="exitForm"
                                class="bg-primary font-medium text-white w-full whitespace-nowrap md:w-fit px-4 p-1 rounded shadow border">Exit
                                Form</button>
                        </DialogFooter>

                    </DialogContent>
                </Dialog>

                <div class="flex flex-row ml-auto items-center px-3 gap-2 rounded-lg text-black/70">

                    <button @click="$router.go(-1)" class="border rounded-lg shadow px-4 text-sm py-1">
                        Cancel
                    </button>

                    <button :disabled="saving" @click="save"
                        class="disabled:opacity-50 px-4 p-1 text-sm font-medium bg-primary rounded text-white">
                        <PhosphorIconSpinner v-if="saving" :size="20" class="animate-spin" />
                        <span v-else>Save</span>
                    </button>
                </div>
            </div>

            <div class="flex flex-col w-full overflow-hidden h-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="text-center">
                                <Checkbox :checked="selectedProducts.length === products.items.length" @update:checked="(val) => { if (val) { selectedProducts = products.items.map((product) => product.id) } else { selectedProducts = [] }  }" />
                            </TableHead>
                            <TableHead class="">
                                Product
                            </TableHead>
                            <TableHead v-if="$viewport.isGreaterThan('tablet')">Variants</TableHead>
                            <TableHead v-if="$viewport.isGreaterThan('tablet')">
                                Status
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow class="cursor-pointer"
                            v-for="product in products?.items">
                            <TableCell class="text-center">
                                <Checkbox :checked="selectedProducts.includes(product.id)" @update:checked="(val) => toggleProduct(product.id, val)" />
                            </TableCell>
                            <TableCell class="font-medium">
                                <div class="flex flex-row items-center gap-2">
                                    <div class="aspect-square w-8 bg-primary rounded bg-center bg-cover"
                                        :style="{ backgroundImage: `url('${getFileUrl(product, product.thumb, { thumb: '50x50' })}')` }">
                                    </div>

                                    <span>{{ product.name }}</span>
                                </div>
                            </TableCell>
                            <TableCell v-if="$viewport.isGreaterThan('tablet')">{{ product.variants.length }} variants</TableCell>
                            <TableCell v-if="$viewport.isGreaterThan('tablet')">
                                <div class="flex flex-row gap-2 text-sm items-center">
                                    <div class="bg-green-500 h-4 aspect-square rounded"></div>

                                    <span>Published</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>


        </div>
    </div>
</template>

<script>
import { getProductGroup, updateProductGroup } from '@/services/products';
import { getProducts } from '@/services/products';
import { getFileUrl } from '~/services/utils';

import { toast } from 'vue-sonner';

export default {
    data() {
        return {
            group: null,
            loading: true,
            products: null,
            saving: false,
            selectedProducts: []
        }
    },
    async mounted() {
        this.group = await getProductGroup(this.$route.params.groupId);
        this.products = await getProducts();
        this.selectedProducts = this.group.products;
    },
    computed: {

    },
    methods: {
        getFileUrl,
        async reloadGroup() {
            this.group = await getProductGroup(this.$route.params.groupId);
        },
        toggleProduct(product, val) {

            if(val) {
                this.selectedProducts.push(product);
            } else {
                this.selectedProducts = this.selectedProducts.filter(p => p !== product);
            }
        },
        async save() {
            try {
                this.saving = true;
                const result = await updateProductGroup(this.group.id, { 'products': this.selectedProducts });

                if(result) {
                    toast.success('Successfully saved product group!');
                    this.$router.go(-1);
                }
            } catch (e) {
                console.error(e);
                toast.error('Failed to save product group! Please try again');
                this.saving = false;
            } finally {
                this.saving = false;
            }
        },
        exitForm() {
            this.$router.go(-1);
        }
    },
    components: {
    }
}
</script>