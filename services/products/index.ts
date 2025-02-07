import Pocketbase from 'pocketbase';

const pocketbase  = new Pocketbase("http://localhost:8090");

export async function getProducts(page : number, numPerPage : number) {
    try {
        const results = await pocketbase.collection('Products').getList(page, numPerPage, {
            expand: 'variants'
        });
        return results;
    } catch(e) {
        throw(e);
    }
}

export async function getProduct(productId : string) {
    try {
        const result = await pocketbase.collection('Products').getOne(productId, {
            expand: 'variants, variantOptions, groups, tags, variants.options'
        });
        return result;
    } catch(e) {
        throw(e);
    }
}

export async function updateProduct(productId : string, options: any) {
    try {
        const result = await pocketbase.collection('Products').update(productId, options);
        return result;
    } catch(e) {
        throw(e);
    }
}

export async function getProductGroup(groupId: string) {
    try {
        const result = await pocketbase.collection('ProductGroups').getOne(groupId, { expand: 'products' });
        return result;
    } catch(e) {
        throw(e);
    }
}

export async function updateProductGroup(groupId: string, options: any) {
    try {
        const result = await pocketbase.collection('ProductGroups').update(groupId, options);
        return result;
    } catch(e) {
        throw(e);
    }
}

export async function deleteProductGroup(groupId: string) {
    try {
        const result = await pocketbase.collection('ProductGroups').delete(groupId);
        return result;
    } catch(e) {
        throw(e);
    }
}

export async function deleteProduct(productId: string) {
    try {
        const result = await pocketbase.collection('Products').delete(productId);
        return result;
    } catch(e) {
        throw(e);
    }
}



export async function getProductGroups() {
    try {
        const results = await pocketbase.collection('ProductGroups').getList();
        return results.items;
    } catch(e) {
        throw(e);
    }
}

export async function getProductTags() {
    try {
        const results = await pocketbase.collection('ProductTags').getList();
        return results.items;
    } catch(e) {
        throw(e);
    }
}




export async function createProduct(formData : any) {
    // if hasVariants is false skip the creations of options
    try {
        console.log(formData);
        let variants : string[] = [];
        let options : any = [];
        if(formData.details.hasVariants) {

            for(let option of formData.details.variantOptions) {
                for(let value of option.values) {
                    const variantOption = await pocketbase.collection('ProductVariantOptions').create({ name: option.name, value: value });
                    options.push(variantOption);
                }
            }

            for(let variant of formData.details.variants) {
                let _options = [];
                for(let option of variant.options) {
                    const opt = options.find((opt : any) => (opt.name === option.name && opt.value === option.value));
                    if(opt) {
                        _options.push(opt.id);
                    }
                }


                const _variant = await pocketbase.collection('ProductVariants').create({ options: _options, stock: variant.stock, cost: variant.cost, price: variant.price, allowBackorder: variant.allowBackOrder, manageInventory: variant.manageInventory, media: [...variant.media], thumb: variant.thumb === null ? (variant.media.length > 0 ? variant.media[0] : null ) : variant.thumb });
                variants.push(_variant.id);
            }




        } else {

            const defaultVariant = await pocketbase.collection('ProductVariants').create({ options: [], stock: formData.details.defaultVariant.stock, cost: formData.details.defaultVariant.cost, price: formData.details.defaultVariant.price, allowBackorder: formData.details.defaultVariant.allowBackOrder, manageInventory: formData.details.defaultVariant.manageInventory, media: [...formData.details.media], thumb:formData.details.thumb === null ? ( formData.details.media.length > 0 ? formData.details.media[0] : null  ) : formData.details.thumb });

            variants = [defaultVariant.id];
        }


        // create product
        const product = await pocketbase.collection('Products').create({
            name: formData.details.name,
            description: formData.details.description,
            tags: formData.categorization.tags.join(','),
            hasVariants: formData.details.hasVariants,
            variants: variants,
            variantOptions: [...options.map(opt => opt.id)],
            media: [...formData.details.media],
            thumb: formData.details.thumb === null ? ( formData.details.media.length > 0 ? formData.details.media[0] : null  ) : formData.details.thumb
        });

        //assign each of the groups to the said product
        for(let group of formData.categorization.groups) {
            try {
                await pocketbase.collection('ProductGroups').update(group.id, { 'products+': [product.id] });
            } catch(e) {
                throw(e)
            }
        }

        return product;
    } catch(e) {
        throw(e);
    }
}

export async function createProductGroup(name : string, description: string, cover: File) {
    try {
        const productGroup = await pocketbase.collection('ProductGroups').create({ name: name, description: description, cover: cover });

        return productGroup;
    } catch (e) {
        throw(e);
    }
}

export async function getFeaturedProductGroups(page, numPerPage) {
    try {
        const results = await pocketbase.collection('FeaturedProductGroups').getList(page, numPerPage);
        return results.items;
    } catch(e) {
        throw(e);
    }
}

export async function updateFeaturedProductGroup(groupId: string, options: any) {
    try {
        const result = await pocketbase.collection('FeaturedProductGroups').update(groupId, options);
        return result;
    } catch(e) {
        throw(e);
    }
}

export async function deleteFeaturedProductGroup(groupId: string) {
    try {
        const result = await pocketbase.collection('FeaturedProductGroups').delete(groupId);
        return result;
    } catch(e) {
        throw(e);
    }
}

export async function createFeaturedProductGroup(title : string) {
    try {
        const productGroup = await pocketbase.collection('FeaturedProductGroups').create({ title: title });

        return productGroup;
    } catch (e) {
        throw(e);
    }
}

export async function getFeaturedProductGroup(featuredGroupId : string) {
    try {
        const result = await pocketbase.collection('FeaturedProductGroups').getOne(featuredGroupId, { expand: 'products' });
        return result;
    } catch(e) {
        throw(e);
    }
}