<template>
    <div class=" w-full flex flex-col shadow overflow-hidden rounded-lg ">
        <div class="flex bg-white items-center gap-3 flex-row border rounded-t-lg px-5 py-3">
            <span class="text-lg font-medium">Media</span>

            <div class="ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <button class="hover:bg-black/10 rounded-lg p-1 transition-all duration-400 ease-in-out">
                            <PhosphorIconDotsThree :size="24" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem @click="$router.push(`/main/products/${product.id}/media/`)" >
                            <PhosphorIconPencilSimple :size="14" /> Edit
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <div class=" bg-white divide-y border-x border-b rounded-b-lg grid grid-cols-2 lg:grid-cols-5 p-5 gap-3">
            <button class="aspect-square w-full bg-primary rounded bg-center bg-cover border"
                :style="{ backgroundImage: `url('${getFileUrl(product, image, { thumb: '256x256' })}')` }"
                v-for="image in product.media"></button>
        </div>
    </div>
</template>

<script>
import { getFileUrl } from '~/services/utils';

export default {
    props: ['product'],
    methods: {
        getFileUrl
    },
    components: {
    }
}
</script>