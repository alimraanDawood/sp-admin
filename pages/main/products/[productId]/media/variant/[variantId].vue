<template>
    <div class="flex flex-col w-full h-[100dvh] p-3 bg-black/20 overflow-hidden">
        <div v-if="variant !== null" class="flex flex-col w-full h-full rounded-lg bg-white border shadow">
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
                    <img :src="getFileUrl(variant, current, { thumb: '50x50' })" class="h-64 rounded-xl border" />
                </div>
    
                <div class="flex flex-row items-center justify-center w-full p-3 border-t gap-2">
                    <button class="aspect-square bg-primary w-8 bg-center bg-cover border rounded-lg" :style="{ backgroundImage: `url('${getFileUrl(variant, image, { thumb: '50x50' })}')` }" @click="current = image" :class="{ 'border-2 border-primary': current === image }" v-for="image in variant?.media"></button>
                </div>
            </div>
            
            <div v-else-if="mode === 'EDIT'" class="flex flex-col overflow-hidden h-full w-full">
                <div class="flex flex-col h-full lg:grid lg:grid-cols-[1fr_560px] overflow-hidden">
                    <div class="flex flex-col bg-black/5 h-full w-full overflow-y-scroll">
                        <div v-if="loading" class="bg-black/5 grid grid-cols-4 p-3 gap-3">
                            <div class="flex flex-col w-full justify-end items-end group bg-black/10 rounded-lg animate-pulse aspect-square" v-for="i in 12">
                            </div>
                        </div>
    
                        <MediaGrid v-else :record="variant" v-model:media="this.media" />
                    </div>
                    
                    <div class="flex flex-col h-full w-full">
                        <AddMediaCom :loading="uploading" @filesAdded="addFiles" />
                    </div>
                </div>

                <div class="flex flex-row items-center justify-end w-full p-3 border-t gap-2">
                    <button v-wave class="px-4 p-1 bg-[#fafafa] hover:bg-black/5 shadow border text-black text-sm rounded">Cancel</button>
                    <button @click="saveMedia" :disabled="uploading" v-wave class="disabled:opacity-50 px-4 p-1 bg-primary text-white text-sm rounded">
                        <PhosphorIconSpinner v-if="uploading" class="animate-spin" :size="20" />
                        <span v-else>Save</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getProductVariant, updateProductVariant } from '@/services/products';
import { getFileUrl } from '~/services/utils';
import AddMediaCom from '@/components/Widgets/Product/ProductMedia/AddMediaCom';
import { toast } from 'vue-sonner';

import MediaGrid from '@/components/MediaGrid/MediaGrid.vue';


export default {
    setup() {

    },
    data() {
        return {
            mode: 'GALLERY', // GALLERY || EDIT
            variant: null,
            loading: true,
            current: null,
            uploading: false
        }
    },
    async mounted() {
        this.loading = true;
        this.variant = await getProductVariant(this.$route.params.variantId);
        if(this.variant) {
            this.current = this.variant.media[0];
        }

        this.loading = false;
    },
    computed: {
        media: {
            get() {
                return this.variant.media;
            },
            set(val) {
                console.log(val)
                this.variant.media = val;
                this.updateMediaOrder(this.variant.media);
            } 
        }
    },
    methods: {
        getFileUrl,
        async reloadVariant() {
            this.variant = await getProductVariant(this.$route.params.variantId);
            if(this.variant) {
                this.current = this.variant.media[0];
            }
        },
        async addFiles(files) {
            // const newMedia = files.map(file => URL.createObjectURL(file));
            // this.media = [...new Set([...this.media, ...newMedia])];

            // upload the file and reload the media
            try {
                this.uploading  = true;
                const result = await updateProductVariant(this.variant.id, { 'media+': [...files] });

                if(result) {
                    await this.reloadVariant();
                }
                toast.success("Successfully updated Variant!");

            } catch(e) {
                console.error(e);
                toast.error("We were unable to update the variant media! Try again later.")
            }

            this.uploading = false;
        },
        async updateMediaOrder(order) {
            try {
                this.uploading = true;
                const result = await updateProductVariant(this.variant.id, { 'media': order, thumb: order[0] });

                if(result) {
                    await this.reloadVariant();
                }

                toast.success("Successfully updated Variant!");
            } catch(e) {
                console.error(e);
                toast.error("We were unable to update the variant media! Try again later.")
            }

            this.uploading = false;

        },
        saveMedia() {
            this.$router.go(-1);    
        },
        downloadCurrent() {
            const link = document.createElement('a');
            link.href = getFileUrl(this.variant, this.current);
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
                const result = await updateProductVariant(this.variant.id, {
                    'media-': [this.current] 
                });

                if(result) {
                    toast.success("Successfully deleted image!");
                    await this.reloadVariant();
                }
            } catch(e) {
                console.error(e);

                toast.error("Failed to delete image! Please try again!")
            }
        },
        async deleteImage(image) {
            try {
                const result = await updateProductVariant(this.variant.id, {
                    'media-': [image] 
                });

                if(result) {
                    toast.success("Successfully deleted image!");
                    await this.reloadVariant();
                }
            } catch(e) {
                console.error(e);

                toast.error("Failed to delete image! Please try again!")
            }
        }
    },
    components: {
        AddMediaCom,
        MediaGrid
    },
    
}
</script>