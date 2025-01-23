<template>

    <Dialog v-if="$viewport.isGreaterThan('tablet')">
        <DialogTrigger>
            <button type="button" class="bg-[#fafafa] hover:bg-black/5 border shadows rounded px-4 p-1">
                {{ media.length === 0 ? 'Add Media' : `Manage ${media.length} Files` }}
            </button>
        </DialogTrigger>

        <DialogContent>
            <DialogHeader>
                <DialogTitle>Manage Variant Media</DialogTitle>
            </DialogHeader>

            <div class="flex flex-col gap-5 p-5 w-full">
                <button type="button" @click="addMedia" ref="dropZoneRef"
                    class="w-full outline-2 outline-dashed rounded-lg p-5 items-center flex text-black/50 flex-col justify-center gap-1 hover:outline-blue-500"
                    :class="{ 'outline-blue-500 text-blue-500': isOverDropZone }">
                    <div class="flex flex-row gap-1 items-center font-semibold">
                        <PhosphorIconDownloadSimple :size="20" />

                        Upload Files
                    </div>
                    <span>Drag and drop images here or click to upload</span>
                </button>

                <div ref="sortable" class="flex flex-col gap-1">
                    <div :key="index" v-for="file, index in media"
                        class="flex flex-row items-center gap-3 p-2 border rounded-lg w-full shadow">
                        <button type="button" class="hover:cursor-grab active:cursor-grabbing">
                            <PhosphorIconDotsSixVertical :size="24" />
                        </button>

                        <div class="bg-primary w-12 aspect-square rounded bg-cover bg-center"
                            :style="{ backgroundImage: `url('${getURL(file)}')` }"></div>

                        <div class="flex flex-col w-full">
                            <span class="text-sm">{{ file.name }}</span>
                            <span class="text-xs">{{ formatFileSize(file.size) }}</span>
                        </div>

                        <div class="flex flex-row items-center gap-2">
                            <button type="button">
                                <PhosphorIconDotsThree :size="20" />
                            </button>

                            <button @click="deleteImage(file)" type="button">
                                <PhosphorIconX :size="20" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <DialogFooter>
                <DialogClose class="w-full">
                    <button v-wave class="p-2 flex flex-row items-center w-full justify-center rounded font-medium text-white bg-primary">
                        Done
                    </button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    <Drawer v-else>
        <DrawerTrigger>
            <button type="button" class="bg-[#fafafa] hover:bg-black/5 border shadows rounded px-4 p-1">
                {{ media.length === 0 ? 'Add Media' : `Manage ${media.length} Files` }}
            </button>
        </DrawerTrigger>

        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Manage Variant Media</DrawerTitle>
            </DrawerHeader>

            <div class="flex flex-col gap-5 p-5 w-full">
                <button type="button" @click="addMedia" ref="dropZoneRef"
                    class="w-full outline-2 outline-dashed rounded-lg p-5 items-center flex text-black/50 flex-col justify-center gap-1 hover:outline-blue-500"
                    :class="{ 'outline-blue-500 text-blue-500': isOverDropZone }">
                    <div class="flex flex-row gap-1 items-center font-semibold">
                        <PhosphorIconDownloadSimple :size="20" />

                        Upload Files
                    </div>
                    <span>Drag and drop images here or click to upload</span>
                </button>

                <div ref="sortable" class="flex flex-col gap-1">
                    <div :key="index" v-for="file, index in media"
                        class="flex flex-row items-center gap-3 p-2 border rounded-lg w-full shadow">
                        <button type="button" class="hover:cursor-grab active:cursor-grabbing">
                            <PhosphorIconDotsSixVertical :size="24" />
                        </button>

                        <div class="bg-primary w-12 aspect-square rounded bg-cover bg-center"
                            :style="{ backgroundImage: `url('${getURL(file)}')` }"></div>

                        <div class="flex flex-col w-full">
                            <span class="text-sm">{{ file.name }}</span>
                            <span class="text-xs">{{ formatFileSize(file.size) }}</span>
                        </div>

                        <div class="flex flex-row items-center gap-2">
                            <button type="button">
                                <PhosphorIconDotsThree :size="20" />
                            </button>

                            <button @click="deleteImage(file)" type="button">
                                <PhosphorIconX :size="20" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <DrawerFooter>
                <DrawerClose class="w-full">
                    <button v-wave class="p-2 flex flex-row items-center w-full justify-center rounded font-medium text-white bg-primary">
                        Done
                    </button>
                </DrawerClose>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>

</template>

<script setup>
import { useDropZone } from '@vueuse/core'
import { useSortable } from '@vueuse/integrations/useSortable'

const { $viewport } = useNuxtApp();

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const dropZoneRef = ref();
const media = computed({
    get() {
        return props.modelValue;
    },
    
    set(value) {
        emit('update:modelValue', value);
    }
});


const sortable = ref();
useSortable(sortable, media, { animation: 150 });

function onDrop(files) {
    console.log(files);
    media.value = [...media.value, ...files];
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

function formatFileSize(size) {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

function getURL(file) {
    return URL.createObjectURL(file);
}

function deleteImage(file) {
    media.value = media.value.filter((f) => f !== file);
    URL.revokeObjectURL(file);
}
</script>