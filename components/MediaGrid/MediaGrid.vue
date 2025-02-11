<template>
    <div ref="mediaContainer" id="mediaContainer"
        class=" grid grid-cols-4 p-3 gap-3">
        <div class="aspect-square bg-primary w-full group p-3 flex flex-col items-end justify-start bg-center bg-cover border rounded-lg"
            :style="{ backgroundImage: `url('${getFileUrl(record, image, { thumb: '50x50' })}')` }" :key="index"
            v-for="image, index in _media">

            <!-- <button @click="emit('delete-image', image)"
                class="p-2 rounded bg-primary opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out text-white">
                <PhosphorIconTrash :size="18" />
            </button> -->
        </div>
    </div>
</template>

<script setup>
import { useSortable } from '@vueuse/integrations/useSortable';
import { getFileUrl } from '~/services/utils';
import { useTemplateRef } from 'vue'

const el = useTemplateRef < HTMLElement > ('mediaContainer');

const _media = computed({
    get() {
        return props.media;
    },
    set(value) {
        emit('update:media', value)
    }
});

const props = defineProps(['media', 'record']);
const emit = defineEmits(['update:media', 'delete-image'])

useSortable('#mediaContainer', _media, { animate: 200 });


</script>