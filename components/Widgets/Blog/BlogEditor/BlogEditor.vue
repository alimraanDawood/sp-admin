<template>
    <div class="flex flex-col gap-2 w-full h-full">
        <div class="flex flex-row gap-3 w-full items-center">
            <button @click="triggerSave" v-wave :disabled="saving"
                class="disabled:opacity-50 text-sm p-3 bg-primary text-white font-medium rounded-lg">
                <PhosphorIconSpinner v-if="saving" class="animate-spin" :size="20" />
                <PhosphorIconFloppyDisk v-else :size="20" />
            </button>

            <div v-if="editor"
                class="flex flex-row w-full no-scrollbar overflow-x-scroll items-center p-1 rounded-lg divide-x divide-black/10 bg-black/5">
                <!-- text contrls -->
                <div class="flex flex-row gap-1 items-center px-2">
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10"
                        @click="editor.chain().focus().toggleBold().run()"
                        :disabled="!editor.can().chain().focus().toggleBold().run()"
                        :class="{ '!bg-primary !text-white': editor.isActive('bold') }">
                        <PhosphorIconTextB :size="20" />
                    </button>
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10"
                        @click="editor.chain().focus().toggleItalic().run()"
                        :disabled="!editor.can().chain().focus().toggleItalic().run()"
                        :class="{ '!bg-primary !text-white': editor.isActive('italic') }">
                        <PhosphorIconTextItalic :size="20" />
                    </button>
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10"
                        @click="editor.chain().focus().toggleStrike().run()"
                        :disabled="!editor.can().chain().focus().toggleStrike().run()"
                        :class="{ '!bg-primary !text-white': editor.isActive('strike') }">
                        <PhosphorIconTextStrikethrough :size="20" />
                    </button>
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10"
                        @click="editor.chain().focus().toggleUnderline().run()"
                        :disabled="!editor.can().chain().focus().toggleUnderline().run()"
                        :class="{ '!bg-primary !text-white': editor.isActive('underline') }">
                        <PhosphorIconTextUnderline :size="20" />
                    </button>
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10"
                        @click="editor.chain().focus().setParagraph().run()"
                        :class="{ '!bg-primary !text-white': editor.isActive('paragraph') }">
                        <PhosphorIconParagraph :size="20" />
                    </button>
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10"
                        @click="editor.chain().focus().toggleBulletList().run()"
                        :class="{ '!bg-primary !text-white': editor.isActive('bulletList') }">
                        <PhosphorIconListBullets :size="20" />
                    </button>
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10"
                        @click="editor.chain().focus().toggleOrderedList().run()"
                        :class="{ '!bg-primary !text-white': editor.isActive('orderedList') }">
                        <PhosphorIconListNumbers :size="20" />
                    </button>
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10"
                        @click="editor.chain().focus().toggleBlockquote().run()"
                        :class="{ '!bg-primary !text-white': editor.isActive('blockquote') }">
                        <PhosphorIconQuotes :size="20" />
                    </button>
                </div>

                <div class="flex flex-row gap-1 items-center px-2">
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10"
                        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                        :class="{ '!bg-primary !text-white': editor.isActive('heading', { level: 1 }) }">
                        <PhosphorIconTextHOne :size="20" />
                    </button>
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10"
                        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                        :class="{ '!bg-primary !text-white': editor.isActive('heading', { level: 2 }) }">
                        <PhosphorIconTextHTwo :size="20" />
                    </button>
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10"
                        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                        :class="{ '!bg-primary !text-white': editor.isActive('heading', { level: 3 }) }">
                        <PhosphorIconTextHThree :size="20" />
                    </button>
                </div>

                <div class="flex flex-row gap-1 items-center px-2">
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10"
                        @click="editor.chain().focus().undo().run()"
                        :disabled="!editor.can().chain().focus().undo().run()">
                        <PhosphorIconArrowCounterClockwise :size="20" />
                    </button>
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10"
                        @click="editor.chain().focus().redo().run()"
                        :disabled="!editor.can().chain().focus().redo().run()">
                        <PhosphorIconArrowClockwise :size="20" />
                    </button>
                </div>

                <div class="flex flex-row gap-1 items-center px-2">
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10" @click="addImage">
                        <PhosphorIconImage :size="20" />
                    </button>

                    <button v-if="editor.isActive('link')" class="rounded-lg p-2 text-black/70 hover:bg-black/10" @click="editor.chain().focus().unsetLink().run()">
                        <PhosphorIconLinkBreak  :size="20" />
                    </button>
                    
                    <button v-else class="rounded-lg p-2 text-black/70 hover:bg-black/10" @click="dialogs.link.open = true">
                        <PhosphorIconLink :size="20" />
                    </button>

                    
                </div>

                <div class="flex flex-row gap-1 items-center px-2">
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10"
                        @click="editor.chain().focus().setTextAlign('left').run()"
                        :class="{ '!bg-primary !text-white': editor.isActive({ textAlign: 'left' }) }">
                        <PhosphorIconTextAlignLeft :size="20" />
                    </button>
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10"
                        @click="editor.chain().focus().setTextAlign('center').run()"
                        :class="{ '!bg-primary !text-white': editor.isActive({ textAlign: 'center' }) }">
                        <PhosphorIconTextAlignCenter :size="20" />
                    </button>
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10"
                        @click="editor.chain().focus().setTextAlign('right').run()"
                        :class="{ '!bg-primary !text-white': editor.isActive({ textAlign: 'right' }) }">
                        <PhosphorIconTextAlignRight :size="20" />
                    </button>
                    <button class="rounded-lg p-2 text-black/70 hover:bg-black/10"
                        @click="editor.chain().focus().setTextAlign('justify').run()"
                        :class="{ '!bg-primary !text-white': editor.isActive({ textAlign: 'justify' }) }">
                        <PhosphorIconTextAlignJustify :size="20" />
                    </button>
                </div>
            </div>
        </div>

        <div ref="dropZoneRef" class="flex flex-col h-full w-full relative items-center overflow-y-scroll">
            <div v-if="isOverDropZone"
                class="absolute bg-black/10 text-black/70 backdrop-blur grid place-items-center top-0 left-0 w-full h-full z-50 rounded-lg">
                <PhosphorIconImage :size="128" />
            </div>
            <TiptapEditorContent class="flex flex-col outline-none prose w-full" :editor="editor" />
        </div>

        <Dialog v-model:open="dialogs.link.open">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Link</DialogTitle>
                    <DialogDescription>Enter the URL for the link you want to create.</DialogDescription>
                </DialogHeader>

                <div class="flex flex-col w-full gap-1">
                    <span class="font-medium">Link</span>
                    <input v-model="dialogs.link.address" type="url"
                        class="p-2  rounded border-2 focus:border-primary focus:outline-none" />
                </div>

                <DialogFooter>
                    <div class="flex flex-row w-full justify-end gap-3">
                        <DialogClose>
                            <button
                                class="text-sm bg-black/5 px-4 p-1 rounded border font-medium text-black/50">Cancel</button>
                        </DialogClose>
                        <button @click="setLink" class="text-sm bg-primary px-4 p-1 rounded font-medium text-white">Set
                            Link</button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup>
import TextAlign from '@tiptap/extension-text-align'
import ImageResize from 'tiptap-extension-resize-image';
import Link from '@tiptap/extension-link'

import { useDropZone } from '@vueuse/core'

function onDrop(files) {
    const file = files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            editor.value.chain().focus().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(file);
    }
}
const dialogs = ref({
    link: {
        open: false,
        address: '',
    }
})
const dropZoneRef = ref();

function setLink() {
    editor.value
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: dialogs.value.link.address })
        .run();

    dialogs.value.link = {
        open: false,
        address: ''
    }
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

const props = defineProps(['content', 'saving']);
const emit = defineEmits(['save']);

const editor = useEditor({
    content: props.content,
    extensions: [
        TiptapStarterKit,
        ImageResize,
        TiptapImage.configure({
            allowBase64: true,
        }),
        TiptapUnderline,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        Link
    ],
});

function triggerSave() {
    emit('save', editor.value.getHTML());
}

const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result;
                editor.value.chain().focus().setImage({ src: base64 }).run();
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

onMounted(() => {
    if (!!unref(editor)) {
        unref(editor).commands.setContent(props.content);
    }
});
onBeforeUnmount(() => {
    unref(editor).destroy();
});
</script>

<style>
.ProseMirror:focus {
    outline: none;
}

a {
    color: var(--purple);
    cursor: pointer;

    &:hover {
        color: var(--purple-contrast);
    }
}
</style>