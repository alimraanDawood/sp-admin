<template>
    <div class="flex flex-col w-full h-[100dvh] p-3 bg-black/20 overflow-hidden">
        <div v-if="poduct !== null" class="flex flex-col w-full h-full rounded-lg bg-white border shadow">
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
                            <DialogDescription>You have unsaved changes that will be lost if you exit this form.</DialogDescription>
                        </DialogHeader>

                        <DialogFooter class="flex flex-row gap-2 justify-end">
                            <DialogClose class="w-full lg:w-fit"><button class="bg-[#fafafa] hover:bg-black/5 w-full md:w-fit px-4 p-1 rounded shadow border">Cancel</button></DialogClose>
                            <button @click="exitForm" class="bg-primary font-medium text-white w-full whitespace-nowrap md:w-fit px-4 p-1 rounded shadow border">Exit Form</button>
                        </DialogFooter>

                    </DialogContent>
                </Dialog>

                <div v-if="mode === 'GALLERY'" class="flex flex-row ml-auto items-center px-3 gap-2 rounded-lg text-black/70">
                    <button @click="deleteCurrent" class="border rounded-lg shadow p-2">
                        <PhosphorIconTrash :size="18" />
                    </button>

                    <button @click="downloadCurrent" class="border rounded-lg shadow p-2">
                        <PhosphorIconDownload :size="18" />
                    </button>

                    <button @click="mode = 'EDIT'" class="border rounded-lg shadow px-4 text-sm py-1">
                        Edit
                    </button>
                </div>

                <div v-else-if="mode === 'EDIT'" class="flex flex-row ml-auto items-center px-3 gap-2 rounded-lg text-black/70">
                    <button @click="mode = 'GALLERY'" class="border rounded-lg shadow px-4 text-sm py-1">
                        Gallery
                    </button>
                </div>
            </div>

            <div v-if="mode === 'GALLERY'" class="flex flex-col w-full h-full">
                <div class="flex flex-col w-full h-full justify-center items-center p-5 bg-black/5">
                    <img :src="getFileUrl(product, current, { thumb: '50x50' })" class="h-64 rounded-xl border" />
                </div>
    
                <div class="flex flex-row items-center justify-center w-full p-3 border-t gap-2">
                    <button class="aspect-square bg-primary w-8 bg-center bg-cover border rounded-lg" :style="{ backgroundImage: `url('${getFileUrl(product, image, { thumb: '50x50' })}')` }" @click="current = image" :class="{ 'border-2 border-primary': current === image }" v-for="image in product?.media"></button>
                </div>
            </div>
            
            <div v-else-if="mode === 'EDIT'" class="flex flex-col overflow-hidden h-full w-full">
                <div class="flex flex-col h-full lg:grid lg:grid-cols-[1fr_560px] overflow-hidden">
                    <div ref="mediaContainer" class="bg-black/5 grid grid-cols-4 p-3 gap-3 h-full overflow-y-scroll">
                        <button class="aspect-square bg-primary w-full bg-center bg-cover border rounded-lg" :style="{ backgroundImage: `url('${image}')` }" v-for="image in media"></button>
                    </div>
                    
                    <div class="flex flex-col h-full w-full">
                        <AddMediaCom @filesAdded="addFiles" />
                    </div>
                </div>

                <div class="flex flex-row items-center justify-end w-full p-3 border-t gap-2">
                    <button v-wave class="px-4 p-1 bg-[#fafafa] hover:bg-black/5 shadow border text-black text-sm rounded">Cancel</button>
                    <button v-wave class="px-4 p-1 bg-primary text-white text-sm rounded">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getProduct, updateProduct } from '@/services/products';
import { getFileUrl } from '~/services/utils';
import AddMediaCom from '@/components/Widgets/Product/ProductMedia/AddMediaCom';
import VueGridLayout from 'vue-grid-layout';

import { toast } from 'vue-sonner';


export default {
    data() {
        return {
            mode: 'GALLERY', // GALLERY || EDIT
            product: null,
            loading: true,
            current: null,
            media: []
        }
    },
    async mounted() {
        this.product = await getProduct(this.$route.params.productId);
        if(this.product) {
            this.current = this.product.media[0];

            this.media = this.product.media.map((file) => getFileUrl(this.product, file, { thumb: '50x50' }));

        }
    },
    computed: {
    },
    methods: {
        getFileUrl,
        async reloadProduct() {
            this.product = await getProduct(this.$route.params.productId);
            if(this.product) {
                this.current = this.product.media[0];
            }
        },
        addFiles(files) {
            const newMedia = files.map(file => URL.createObjectURL(file));
            this.media = [...new Set([...this.media, ...newMedia])];
        },
        downloadCurrent() {
            const link = document.createElement('a');
            link.href = getFileUrl(this.product, this.current);
            link.target = '_blank';
            link.download = this.current.name || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        exitForm() {
            this.$router.go(-1);
        },
        async deleteCurrent() {
            try {
                const result = await updateProduct(this.product.id, {
                    'media-': [this.current] 
                });

                if(result) {
                    toast.success("Successfully deleled image!");
                    await this.reloadProduct();
                }
            } catch(e) {
                console.error(e);

                toast.error("Failed to delete image! Please try again!")
            }
        }
    },
    components: {
        AddMediaCom
    }
}
</script>