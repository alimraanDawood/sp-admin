<template>
    <div class=" w-full flex flex-col shadow overflow-hidden rounded-lg ">
                    <div class="flex bg-white items-center gap-3 flex-row border rounded-t-lg p-5">
                        <span class="text-lg font-medium">Options</span>

                        <button
                            class="hover:bg-black/10 ml-auto rounded-lg p-1 transition-all duration-400 ease-in-out">
                            <PhosphorIconDotsThree :size="24" />
                        </button>
                    </div>

                    <div class=" bg-white divide-y border-x border-b rounded-b-lg flex flex-col">
                        <div v-for="option in options" class="grid grid-cols-3 px-5 p-3 gap-2">
                            <span>{{ option.name }}</span>

                            <div class="flex flex-row gap-1 items-center">
                                <div v-for="value in option.values"
                                    class="bg-black/5 p-1 px-2 rounded text-sm font-medium text-black/50">{{ value }}
                                </div>
                            </div>

                            <div class="flex flex-row justify-end items-center w-full">
                                <button
                                    class="hover:bg-black/10 rounded-lg p-1 transition-all duration-400 ease-in-out">
                                    <PhosphorIconDotsThree :size="24" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
</template>

<script>
export default {
    props: ['product'],
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

            return [];
        }
    }
}
</script>