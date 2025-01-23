<template>
    <div class="flex flex-col w-full h-[100dvh] p-3 bg-black/20">
        <div class="flex flex-col w-full h-full rounded-lg bg-white border shadow">
            <div class="flex flex-row w-full border-b divide-x">
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

                <div class="hidden lg:flex flex-row divide-x">
                    <button @click="switchTo('DETAILS')" :disabled="lock" class="disabled:opacity-50 flex flex-row items-center gap-1 text-black/50 p-3 bg-[#FAFAFA] hover:bg-black/5 w-44" :class="{ '!bg-white hover:bg-white' : currentStage === 'DETAILS' }">
                        <PhosphorIconCircleHalf weight="fill" class="text-blue-500" v-if="currentStage === 'DETAILS'" :size="18" />
                        <PhosphorIconCircleDashed v-else :size="18" />
    
                        Details
                    </button>
    
                    <button @click="switchTo('CATEGORIZATION')" :disabled="lock" class="disabled:opacity-50 flex flex-row items-center gap-1 text-black/50 p-3 bg-[#FAFAFA] hover:bg-black/5 w-44" :class="{ '!bg-white hover:bg-white' : currentStage === 'CATEGORIZATION' }">
                        <PhosphorIconCircleHalf weight="fill" class="text-blue-500" v-if="currentStage === 'CATEGORIZATION'" :size="18" />
                        <PhosphorIconCircleDashed v-else :size="18" />
    
                        Categorization
                    </button>
    
                    <button @click="switchTo('VARIANTS')" :disabled="lock" class="disabled:opacity-50 flex flex-row items-center gap-1 text-black/50 p-3 bg-[#FAFAFA] hover:bg-black/5 w-44" :class="{ '!bg-white hover:bg-white' : currentStage === 'VARIANTS' }">
                        <PhosphorIconCircleHalf weight="fill" class="text-blue-500" v-if="currentStage === 'VARIANTS'" :size="18" />
                        <PhosphorIconCircleDashed v-else :size="18" />
    
                        Variants
                    </button>
    
                    <button @click="switchTo('PUSH')" class="flex flex-row items-center gap-1 text-black/50 p-3 bg-[#FAFAFA] hover:bg-black/5 w-44" :class="{ '!bg-white hover:bg-white' : currentStage === 'PUSH' }">
                        <PhosphorIconSpinner weight="regular" class="text-blue-500 animate-spin" v-if="currentStage === 'PUSH' && lock" :size="18" />
                        <PhosphorIconCircleHalf weight="fill" class="text-blue-500" v-if="currentStage === 'PUSH' && !lock" :size="18" />
                        <PhosphorIconCircleDashed v-else :size="18" />
    
                        Uploading
                    </button>
                </div>

                <div class="flex lg:hidden items-center p-3 gap-3 text-black/50 text-sm flex-row">
                    <div class="flex flex-row gap-1">
                        <button @click="prev()" :disabled="lock || currentStage === 'DETAILS'" class="disabled:opacity-50">
                            <PhosphorIconCaretLeft :size="20" />
                        </button>
                        <button @click="next()" :disabled="lock || currentStage === 'PUSH'" class="disabled:opacity-50">
                            <PhosphorIconCaretRight :size="20" />
                        </button>
                    </div>
                    <span>Step {{ stepIndex }} of 4</span>
                </div>

            </div>

            <!-- Main Body -->
            <div class="flex flex-col w-full h-full items-center overflow-y-scroll">
                <div class="flex flex-col h-full w-full items-center p-3">
                    <CreateProductDetails v-show="currentStage === 'DETAILS'" ref="detailsForm" @complete="nextForm" :form-values="forms.details" @update:formValues="(val) => { forms.details = val; forms.variants.variants = forms.details.variants }" />
                    <CreateProductCategorization v-show="currentStage === 'CATEGORIZATION'" ref="categorizationForm" @complete="nextForm" :form-values="forms.categorization" @update:formValues="(val) => forms.categorization = val" />
                    <CreateProductVariants v-show="currentStage === 'VARIANTS'" ref="variantsForm" @complete="nextForm" :form-values="forms" @update:formValues="(val) => forms.variants = val" />
                    <PushProduct v-show="currentStage === 'PUSH'" @upload-started="lock = true" @upload-finished="lock = false" />
                    
                </div>
            </div>

            <div class="border-t p-3 flex flex-row gap-2 items-center justify-end">
                <button v-wave class="px-4 p-1 bg-[#fafafa] hover:bg-black/5 shadow border text-black text-sm rounded">Cancel</button>
                <button @click="save" v-wave class="px-4 p-1 bg-primary text-white text-sm rounded">Save as draft</button>
                <button v-wave class="px-4 p-1 bg-primary text-white text-sm rounded" @click="next">{{ currentStage === 'VARIANTS' ? 'Finish' : 'Next'  }}</button>
            </div>
        </div>
    </div>
</template>

<script>

import CreateProductDetails from '@/components/Forms/Products/Create/CreateProductDetails.vue';
import CreateProductCategorization from '~/components/Forms/Products/Create/CreateProductCategorization.vue';
import CreateProductVariants from '~/components/Forms/Products/Create/CreateProductVariants.vue';
import PushProduct from '@/components/Forms/Products/Create/PushProduct.vue';

import { getProducts } from '~/services/products';

import { mapStores } from 'pinia';
import { useProductStore } from '~/stores/product';
import { toast } from 'vue-sonner'

definePageMeta({
    breadcrumbs: [{
        label: 'Products',
        link: '/main/products/'
    },
    {
        label: 'Create',
        link: '/main/products/create'
    }],
    sidebarLink: 'Products'
})

export default {
    data() {
        return {
            page: null,
            lock: false,
            currentStage: 'DETAILS', // DETAILS | CATEGORIZATION | VARIANTS            
        }
    },
    mounted() {
        
    },
    methods: {
        toast,
        save() {
            this.productStore.saved.create = {...this.productStore.create};
            console.log(this.productStore.saved)
            toast('Draft Saved!', {});
        },
        load() {
            if (this.productStore.saved.create) {
                this.productStore.create = { ...this.productStore.saved.create };
            }
            // this.productStore.saved.create = null;

            toast('Saved Draft has been loaded!', {});
        },
        prev() {
            const stages = ['DETAILS', 'CATEGORIZATION', 'VARIANTS', 'PUSH'];
            const currentIndex = stages.indexOf(this.currentStage);
            if (currentIndex > 0) {
                this.currentStage = stages[currentIndex - 1];
            }
        },
        next() {
            this.currentForm.validator.$validate();
            if(this.currentForm.validator.$errors.length === 0) {
                this.nextForm();
            } else {
                console.log(this.currentForm.validator.$errors)
            }
        },
        nextForm() {
            switch (this.currentStage) {
                case 'DETAILS':
                    this.currentStage = 'CATEGORIZATION';
                    break;
                case 'CATEGORIZATION':
                    this.currentStage = 'VARIANTS';
                    break;
                case 'VARIANTS':
                    this.currentStage = 'PUSH';
                    break;
                default:
                    this.currentStage = 'DETAILS';
            }
        },
        
        switchTo(stage) {
            this.currentForm.validator.$validate();
            if(this.currentForm.validator.$errors.length === 0) {
                this.currentStage = stage;
            }
        },
        exitForm() {
            this.productStore.resetCreateForms();
            this.$router.go(-1);
        }
    },
    computed: {
        ...mapStores(useProductStore),
        forms() {
            return this.productStore.create.forms;
        },
        stepIndex() {
            const stages = ['DETAILS', 'CATEGORIZATION', 'VARIANTS', 'PUSH'];
            return stages.indexOf(this.currentStage) + 1;
        },
        currentForm() {
            switch(this.currentStage) {
                case 'DETAILS':
                    return this.$refs.detailsForm;

                case 'CATEGORIZATION':
                    return this.$refs.categorizationForm;

                case 'VARIANTS':
                    return this.$refs.variantsForm;
                default:
                    return this.$refs.detailsForm;
            }
        }
    },
    components: {
        CreateProductDetails,
        CreateProductCategorization,
        CreateProductVariants,
        PushProduct
    }
}
</script>