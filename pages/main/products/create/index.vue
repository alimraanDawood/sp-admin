<template>
    <div class="flex flex-col w-full h-[100dvh] p-3 bg-black/20">
        <div class="flex flex-col w-full h-full rounded-lg bg-white border shadow">
            <div class="flex flex-row w-full border-b divide-x">
                <button :disabled="currentStage === 'PUSH'" class="flex flex-row items-center gap-3 p-3">
                    <PhosphorIconX :size="18" />

                    <span class="bg-black/5 border text-black/50 px-2 p-1 text-sm shadow rounded">esc</span>
                </button>


                <button @click="switchTo('DETAILS')" :disabled="currentStage === 'PUSH'" class="disabled:opacity-50 flex flex-row items-center gap-1 text-black/50 p-3 bg-[#FAFAFA] hover:bg-black/5 w-44" :class="{ '!bg-white hover:bg-white' : currentStage === 'DETAILS' }">
                    <PhosphorIconCircleHalf weight="fill" class="text-blue-500" v-if="currentStage === 'DETAILS'" :size="18" />
                    <PhosphorIconCircleDashed v-else :size="18" />

                    Details
                </button>

                <button @click="switchTo('CATEGORIZATION')" :disabled="currentStage === 'PUSH'" class="disabled:opacity-50 flex flex-row items-center gap-1 text-black/50 p-3 bg-[#FAFAFA] hover:bg-black/5 w-44" :class="{ '!bg-white hover:bg-white' : currentStage === 'CATEGORIZATION' }">
                    <PhosphorIconCircleHalf weight="fill" class="text-blue-500" v-if="currentStage === 'CATEGORIZATION'" :size="18" />
                    <PhosphorIconCircleDashed v-else :size="18" />

                    Categorization
                </button>

                <button @click="switchTo('VARIANTS')" :disabled="currentStage === 'PUSH'" class="disabled:opacity-50 flex flex-row items-center gap-1 text-black/50 p-3 bg-[#FAFAFA] hover:bg-black/5 w-44" :class="{ '!bg-white hover:bg-white' : currentStage === 'VARIANTS' }">
                    <PhosphorIconCircleHalf weight="fill" class="text-blue-500" v-if="currentStage === 'VARIANTS'" :size="18" />
                    <PhosphorIconCircleDashed v-else :size="18" />

                    Variants
                </button>

                <button v-if="currentStage === 'PUSH'" class="flex flex-row items-center gap-1 text-black/50 p-3 bg-[#FAFAFA] hover:bg-black/5 w-44" :class="{ '!bg-white hover:bg-white' : currentStage === 'PUSH' }">
                    <PhosphorIconSpinner weight="regular" class="text-blue-500 animate-spin" v-if="currentStage === 'PUSH'" :size="18" />
                    <PhosphorIconCircleDashed v-else :size="18" />

                    Uploading
                </button>
            </div>

            <!-- Main Body -->
            <div class="flex flex-col w-full h-full items-center overflow-y-scroll">
                <div class="flex flex-col h-full w-full items-center p-3">
                    <CreateProductDetails v-show="currentStage === 'DETAILS'" ref="detailsForm" @complete="nextForm" :form-values="forms.details" @update:formValues="(val) => { forms.details = val; forms.variants.variants = forms.details.variants }" />
                    <CreateProductCategorization v-show="currentStage === 'CATEGORIZATION'" ref="categorizationForm" @complete="nextForm" :form-values="forms.categorization" @update:formValues="(val) => forms.categorization = val" />
                    <CreateProductVariants v-show="currentStage === 'VARIANTS'" ref="variantsForm" @complete="nextForm" :form-values="forms" @update:formValues="(val) => forms.variants = val" />
                        
                    <div v-show="currentStage === 'PUSH'" class="flex gap-1 flex-col w-full h-full items-center justify-center">
                        <span>Creating Product Please Wait!</span>
                        <div class="w-[500px] h-1 bg-black/10 rounded"></div>
                        {{ productStore.create.forms }}
                    </div>
                </div>
            </div>

            <div class="border-t p-3 flex flex-row gap-2 items-center justify-end">
                <button v-wave class="px-4 p-1 bg-[#fafafa] hover:bg-black/5 shadow border text-black text-sm rounded">Cancel</button>
                <button v-wave class="px-4 p-1 bg-primary text-white text-sm rounded">Save as draft</button>
                <button v-wave class="px-4 p-1 bg-primary text-white text-sm rounded" @click="next">{{ currentStage === 'VARIANTS' ? 'Finish' : 'Next'  }}</button>
            </div>
        </div>
    </div>
</template>

<script>

import CreateProductDetails from '@/components/Forms/Products/Create/CreateProductDetails.vue';
import CreateProductCategorization from '~/components/Forms/Products/Create/CreateProductCategorization.vue';
import CreateProductVariants from '~/components/Forms/Products/Create/CreateProductVariants.vue';
import { getProducts } from '~/services/products';

import { mapStores } from 'pinia';
import { useProductStore } from '~/stores/product';


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
            currentStage: 'DETAILS', // DETAILS | CATEGORIZATION | VARIANTS
            
        }
    },
    methods: {
        next() {

            if(this.currentStage === 'VARIANTS') {
                this.currentStage = 'PUSH';
                return;
            }
            this.currentForm.validateForm();
        },
        nextForm() {
            if(this.currentForm.form.meta.value.valid) {
                if(this.currentStage === 'DETAILS') {
                    this.currentStage = 'CATEGORIZATION';
                } else if(this.currentStage === 'CATEGORIZATION') {
                    this.currentStage = 'VARIANTS';
                } else if(this.currentStage === 'VARIANTS') {
                    this.currentStage = 'PUSH';
                }
            }
        },
        switchTo(stage) {
            if(this.currentForm.form.meta.value.valid || this.currentStage === 'VARIANTS') {
                this.currentForm.validateForm();
                this.currentStage = stage;
            }
        }
    },
    computed: {
        ...mapStores(useProductStore),
        forms() {
            return this.productStore.create.forms;
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
    async mounted() {
        this.page =  await getProducts(1, 10);
    },
    components: {
        CreateProductDetails,
        CreateProductCategorization,
        CreateProductVariants,
    }
}
</script>