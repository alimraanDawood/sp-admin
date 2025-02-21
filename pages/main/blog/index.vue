<template>
    <div class="flex flex-col w-full p-3 h-full">
        <ArticleGrid v-model:query="query" @reload="reloadArticles" :loading="page === null" :articles="page?.items" />
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
            _page: null,
            _filtered: null,
            query: ''
        }
    },
    components: {
        ArticleGrid
    },
    async mounted() {
        try {
            this._page = await getArticlesPreview(1, 12);
        } catch(e) {
            console.error(e);
        }
    },
    computed: {
        page() {
            
            if(this.query) {
                return this._filtered;
            }

            return this._page;
        }
    },
    watch: {
        async query(newVal, oldVal) {
            if(newVal) {
                this._filtered = await getArticlesPreview(1, 12, `title ~ '${this.query}'`)
            }
        }
    },
    methods: {
        async reloadArticles() {
            try {
                this._page = await getArticlesPreview(1, 12);
            } catch(e) {
                console.error(e);
            }
        }
    }
}

</script>