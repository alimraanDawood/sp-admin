<template>
    <div class="bg-white h-full w-full flex flex-row shadow overflow-hidden border divide-x rounded-lg">
        <div class="flex flex-col w-full shrink-0 h-full">
            <div class="flex flex-col border-b p-3 gap-3">
                <div class="flex flex-row justify-between items-center gap-3">
                    <span class="font-medium">Articles</span>
                    <div
                        class="hidden lg:flex flex-row text-black/60 border-2 p-1 px-2 gap-2 rounded items-center focus-within:border-primary/60 ml-auto">
                        <PhosphorIconMagnifyingGlass :size="18" weight="bold" />
                        <input v-model="_query" class="w-full bg-transparent outline-none placeholder:text-black/40"
                            placeholder="Search" />
                    </div>

                    <div class="flex flex-row gap-1">
                        <CreateArticle @updated="$emit('reload', true)" />
                    </div>
                </div>

                <div
                    class="flex lg:hidden w-full flex-row text-black/60 border-2 p-1 px-2 gap-2 rounded items-center focus-within:border-primary/60 ml-auto">
                    <PhosphorIconMagnifyingGlass :size="18" weight="bold" />
                    <input v-model="_query" class="w-full bg-transparent outline-none w-full placeholder:text-black/40"
                        placeholder="Search" />
                </div>
            </div>

            <div v-if="loading" class="grid grid-cols-3 w-full h-full p-3 gap-3 overflow-y-scroll">
                <div v-for="i in 12" class="flex flex-col w-full aspect-video bg-black/10 animate-pulse rounded-lg">
                </div>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full h-full p-3 gap-3 overflow-y-scroll">
                <div  v-for="article in articles"
                    class="flex h-fit text-left flex-col">
                    <button @click="$router.push(`/main/blog/article/${article.id}`)" class="w-full aspect-video border border-b-0 shadow bg-primary/10 grid place-items-center rounded-t-lg bg-center bg-cover"
                        :style="{ backgroundImage: `url('${getFileUrl(article, article.cover, { thumb: '50x50' })}')` }">
                        <PhosphorIconImage :size="64" class="text-primary/50" v-if="!article.cover" />
                    </button>
                    <div class="flex flex-col p-2 bg-[#fefefe] w-full border rounded-b-lg gap-2">
                        <span class="font-medium">
                            {{ article.title.length > 80 ? article.title.substring(0, 77) + '...' : article.title }}
                        </span>

                        <div class="flex flex-row gap-1 text-sm text-black/70">
                            <PhosphorIconCalendar :size="20" />

                            {{ new Date(article.date).toLocaleDateString('en-GB') }}

                            <button @click="openEditArticle(article)"
                                class="ml-auto">
                                <PhosphorIconPencil :size="20" />
                            </button>
                            <button @click="deleteArticle(article.id)"
                                class="">
                                <PhosphorIconTrash :size="20" />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <Dialog v-model:open="dialogs.delete.open">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this article?</DialogTitle>
                    <DialogDescription>This action cannot be reversed!</DialogDescription>
                </DialogHeader>

                <DialogFooter class="flex flex-row gap-2 justify-end">
                    <DialogClose class="w-full"><button
                            class="bg-[#fafafa] hover:bg-black/5 w-full px-4 p-1 rounded shadow border">Cancel</button>
                    </DialogClose>
                    <button @click="confirmDeleteArticle"
                        class="bg-primary font-medium text-white w-full whitespace-nowrap px-4 p-1 rounded shadow">Delete</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <EditArticle @updated="$emit('reload', true)" ref="editArticle" v-model:open="dialogs.edit.open" />
    </div>
</template>

<script>
import CreateArticle from './CreateArticle.vue';
import EditArticle from './EditArticle.vue';
import { getFileUrl } from '@/services/utils';

import { deleteArticle } from '@/services/blog';
import { toast } from 'vue-sonner';

export default {
    props: ['articles', 'loading', 'query'],
    emits: ['reload' , 'update:query'],
    data() {
        return {
            showing: 'PUBLISHED', // PUBLISHED | UNPUBLISHED,
            dialogs: {
                delete: {
                    open: false,
                    id: ''
                },
                edit: {
                    open: false,
                    article: null
                }
            }
        }
    },
    computed: {
        _query: {
            get() { return this.query },
            set(val) { this.$emit('update:query', val) }
        }
    },
    methods: {
        getFileUrl,
        deleteArticle(id) {
            this.dialogs.delete.id = id;
            this.dialogs.delete.open = true;
        },
        openEditArticle(article) {
            console.log(this.$refs.editArticle.openEditForm)
            this.$refs.editArticle.openEditForm(article);
        },
        async confirmDeleteArticle() {
            try {
                const deleted = await deleteArticle(this.dialogs.delete.id);

                if (deleted) {
                    toast.success('Article deleted successfully.');
                }
            } catch (e) {
                console.error(e);

                toast.error('Failed to delete article. Please try again.');
            }

            this.dialogs.delete.id = '';
            this.dialogs.delete.open = false;
            this.$emit('reload', true);
        }
    },
    components: {
        CreateArticle,
        EditArticle
    }
}
</script>