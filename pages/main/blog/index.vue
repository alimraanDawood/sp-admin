<template>
    <div class="flex flex-col w-full p-3 h-full">
        <ArticleGrid @reload="reloadArticles" :loading="page === null" :articles="page?.items" />
    </div>
</template>

<script>
import ArticleGrid from '~/components/Widgets/Blog/ArticleGrid/ArticleGrid.vue';
import { getArticlesPreview } from '@/services/blog';

definePageMeta({
    layout: 'main',
    breadcrumbs: [{
        label: 'Blog',
        link: '/main/blog/'
    }],
    sidebarLink: 'Blog'
});

export default {
    data() {
        return {
            page: null
        }
    },
    components: {
        ArticleGrid
    },
    async mounted() {
        try {
            this.page = await getArticlesPreview(1, 12);
        } catch(e) {
            console.error(e);
        }
    },
    methods: {
        async reloadArticles() {
            try {
                this.page = await getArticlesPreview(1, 12);
            } catch(e) {
                console.error(e);
            }
        }
    }
}

</script>