<template>
    <div class="flex flex-col w-full h-[100dvh] p-3 bg-black/20 overflow-hidden">
        <div v-if="articles !== null" class="flex flex-col w-full h-full rounded-lg bg-white border shadow">
            <div class="flex flex-row w-full border-b items-center">
                <Dialog>
                    <DialogTrigger>
                        <button :disabled="lock" class="flex flex-row items-center gap-3 p-3">
                            <PhosphorIconX :size="18" />

                            <span class="bg-black/5 border text-black/50 px-2 p-1 text-sm shadow rounded">esc</span>
                        </button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader class="text-left">
                            <DialogTitle>Are you sure you want to leave this form?</DialogTitle>
                            <DialogDescription>You have unsaved changes that will be lost if you exit this form.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter class="flex flex-row gap-2 justify-end">
                            <DialogClose class="w-full lg:w-fit"><button
                                    class="bg-[#fafafa] hover:bg-black/5 w-full md:w-fit px-4 p-1 rounded shadow border">Cancel</button>
                            </DialogClose>
                            <button @click="exitForm"
                                class="bg-primary font-medium text-white w-full whitespace-nowrap md:w-fit px-4 p-1 rounded shadow border">Exit
                                Form</button>
                        </DialogFooter>

                    </DialogContent>
                </Dialog>

                <div class="flex flex-row ml-auto items-center px-3 gap-2 rounded-lg text-black/70">

                    <button @click="$router.go(-1)" class="border rounded-lg shadow px-4 text-sm py-1">
                        Cancel
                    </button>

                    <button :disabled="saving" @click="save"
                        class="disabled:opacity-50 px-4 p-1 text-sm font-medium bg-primary rounded text-white">
                        <PhosphorIconSpinner v-if="saving" :size="20" class="animate-spin" />
                        <span v-else>Save</span>
                    </button>
                </div>
            </div>

            <div class="flex flex-col w-full overflow-hidden h-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="text-center">
                                <Checkbox />
                            </TableHead>
                            <TableHead class="">
                                Article
                            </TableHead>
                            
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow class="cursor-pointer"
                            v-for="article in articles?.items">
                            <TableCell class="text-center">
                                <Checkbox :checked="article.categories.includes($route.params.categoryId)" @update:checked="(val) => updateArticleCategory(article.id, val)" />
                            </TableCell>
                            <TableCell class="font-medium">
                                <div class="flex flex-row items-center gap-2">
                                    <span>{{ article.title }}</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>
</template>

<script>
import { updateArticle, getArticlesPreview } from '@/services/blog';
import { getFileUrl } from '~/services/utils';

import { toast } from 'vue-sonner';

export default {
    data() {
        return {
            category: null,
            loading: true,
            articles: null,
            saving: false,
            selectedArticles: []
        }
    },
    async mounted() {
        this.articles = await getArticlesPreview(1, 10);
    },
    computed: {
    },
    methods: {
        getFileUrl,
        async reloadArticles() {
            this.articles = await getArticlesPreview(1, 10);
        },
        toggleArticle(article, val) {
            if(val) {
                this.selectedArticles.push(article);
            } else {
                this.selectedArticles = this.selectedArticles.filter(a => a !== article);
            }
        },
        exitForm() {
            this.$router.go(-1);
        },
        async updateArticleCategory(articleId, state) {
            try {
                let result = null;
                if(state) {
                    result = await updateArticle(articleId, { 'categories+': this.$route.params.categoryId })
                } else {
                    result = await updateArticle(articleId, { 'categories-': this.$route.params.categoryId })
                }

                if(result) {
                    this.reloadArticles();
                    toast.success("Successfully updated article!")
                }
            } catch(e) {
                console.error(e);
            }
        },
    },
    components: {
    }
}
</script>
