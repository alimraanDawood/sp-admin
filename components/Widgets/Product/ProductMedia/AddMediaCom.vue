<template>
    <div class="flex flex-col gap-5 p-5 w-full">
        <button v-show="true" :disabled="loading" type="button" @click="addMedia" ref="dropZoneRef"
            class="w-full disabled:animate-pulse outline-2 outline-dashed rounded-lg p-5 items-center flex h-32 text-black/50 flex-col justify-center gap-1 hover:outline-blue-500"
            :class="{ 'outline-blue-500 text-blue-500': isOverDropZone }">
            <div v-if="!loading" class="flex flex-row gap-1 items-center font-semibold">
                <PhosphorIconDownloadSimple :size="20" />

                Upload Files
            </div>
            <span v-if="!loading">Drag and drop images here or click to upload</span>
            <PhosphorIconSpinner v-else :size="32" class="animate-spin" />
        </button>
    </div>
</template>

<script setup>
import { useDropZone } from '@vueuse/core'
import { useSortable } from '@vueuse/integrations/useSortable'

const { $viewport } = useNuxtApp();

const props = defineProps(['modelValue', 'loading']);
const emit = defineEmits(['update:modelValue', 'filesAdded']);

const dropZoneRef = ref();


function onDrop(files) {
    emit('filesAdded', files)
    // called when files are dropped on zone
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop,
    // specify the types of data to be received.
    dataTypes: ['image/jpeg'],
    // control multi-file drop
    multiple: true,
    // whether to prevent default behavior for unhandled events
    preventDefaultForUnhandled: false,
})

function addMedia() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg';
    input.multiple = true;
    input.onchange = (event) => {
        const files = Array.from(event.target.files);
        onDrop(files);
    };
    input.click();
}


</script>