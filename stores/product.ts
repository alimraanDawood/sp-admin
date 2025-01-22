import { defineStore } from 'pinia';
import { createProduct } from '@/services/products';

export const useProductStore = defineStore('product', {
    state: () => ({
        create: {
            forms: {
                details: {
                    name: 'Jacket',
                    description: 'A product description',
                    hasVariants: true,
                    variantOptions: [{ name: 'Size', values: ['SM', 'MD', 'XL'] }, { name: 'Color', values: ['Red', 'Blue', 'Green'] }],
                    variants: []
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
    }),

    actions: {
        async createProduct() {
            const product = await createProduct(this.create.details.variantOptions, this.create.details.variants, this.create.details.name, this.create.details.description, this.create.details.hasVariants);
            console.log(product);
        }
    }
})