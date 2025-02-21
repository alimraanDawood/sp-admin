<template>
    <div class="flex flex-col w-full h-full p-3">
        <div class="flex flex-col bg-white w-full max-h-full">
            <div class="flex flex-row p-3 border rounded-t-xl">
                <span class="text-2xl font-medium">Categories</span>

                <div class="flex flex-row ml-auto gap-2">
                    <CreateCategory @updated="reloadCategories" />
                </div>
            </div>
            <div v-if="page" class="flex flex-col w-full border-x">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="">
                                Name
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow class="cursor-pointer" @click="$router.push(`/main/blog/categories/${category.id}`)" v-for="category in page?.items" :key="category.id">
                            <TableCell>
                                {{ category.name }}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div v-else class="flex divide-y flex-col w-full border-x">
                <div class="p-4 flex flex-row" v-for="i in 10" :key="i">
                    <div class="h-12 flex flex-row w-full bg-black/10 rounded-lg animate-pulse"></div>
                </div>
            </div>

            <div class="flex flex-row p-3 border rounded-b-xl">
                <div v-if="page" class="flex flex-row items-center whitespace-nowrap">
                    Page {{ page.page }} of {{ page.totalPages }} pages

                    <div class="flex flex-row w-full gap-2 items-center">
                        <button @click="prevPage"  :disabled="page.page === 1"  v-wave class="disabled:opacity-50 p-2 border shadow rounded">
                            <PhosphorIconCaretLeft :size="18" />
                        </button>

                        <button @click="nextPage" :disabled="page.page === page.totalPages"  v-wave class="disabled:opacity-50 p-2 border shadow rounded">
                            <PhosphorIconCaretRight :size="18" />
                        </button>
                    </div>
                </div>
                <div v-else class="flex flex-row items-center">
                    <div class="h-8 w-32 bg-black/5 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getCategories } from '~/services/blog';
import { getFileUrl } from '~/services/utils';

import CreateCategory from '@/components/Widgets/Blog/Categories/CreateCategory.vue';

definePageMeta({
    layout: 'main',
    breadcrumbs: [
    {
        label: 'Blog',
        link: '/main/blog/'
    },    
    {
        label: 'Categories',
        link: '/main/blog/categories'
    }],
    sidebarLink: 'Blog-Categories'
})

export default {
    data() {
        return {
            page: null,
        }
    },
    async mounted() {
        this.page = await getCategories(1, 100);
    },
    methods: {
        getFileUrl,
        async reloadCategories() {
            this.page = await getCategories(1, 100);
        },
        async nextPage() {
            if(this.page) {
                if(this.page.page < this.page.totalPages) {
                    this.page = await getCategories(this.page.page + 1, 100);
                    return;
                }
            }
        },
        async prevPage() {
            if(this.page) {
                if(this.page.page > 1) {
                    this.page = await getCategories(this.page.page - 1, 100);
                    return;
                }
            }
        }
    },
    components: {
        CreateCategory
    }
}
</script>