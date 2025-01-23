import { defineStore } from 'pinia';
import { createProduct } from '@/services/products';

export const useProductStore = defineStore('product', {
    state: () => ({
        create: {
            forms: {
                details: {
                    name: '',
                    description: '',
                    hasVariants: false,
                    variantOptions: [{ name: '', values: [] }],
                    variants: [],
                    media: [],
                    thumb: null,
                    defaultVariant: { options: [{name: 'DEFAULT', value: 'DEFAULT' }], allowBackOrder: false, manageInventory: false, price: 0, stock: 0, media: [], thumb: null }
                },
                categorization: {
                    groups: [],
                    tags: []
                },
                variants: {
                    variants: []
                }
            }
        },
        saved: {
            create: null
        }
    }),

    actions: {
        async createProduct() {
            try {
                const product = await createProduct(this.create.forms);
                return product;
            } catch(e) {
                throw(e)
            }
        },
        resetCreateForms() {
            this.create.forms = {
                details: {
                    name: '',
                    description: '',
                    hasVariants: false,
                    variantOptions: [{ name: '', values: [] }],
                    variants: [],
                    media: [],
                    thumb: null,
                    defaultVariant: { options: [{name: 'DEFAULT', value: 'DEFAULT' }], allowBackOrder: false, manageInventory: false, price: 0, stock: 0, media: [], thumb: null }
                },
                categorization: {
                    groups: [],
                    tags: []
                },
                variants: {
                    variants: []
                }
            }
        }
    },

    persist: {
        storage: sessionStorage,
        pick: ['saved.create'],
    }
})