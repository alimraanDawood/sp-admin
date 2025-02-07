<template>
    <div v-if="article" class="flex flex-col w-full p-3 h-full">
        <BlogEditor :saving="saving" @save="saveArticle" :content="article?.content" />
    </div>
</template>

<script>
import BlogEditor from '~/components/Widgets/Blog/BlogEditor/BlogEditor.vue';
import { getArticle, updateArticle } from '@/services/blog';
import { toast } from 'vue-sonner';

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
            article: null,
            saving: false
        }
    },
    async mounted() {
        try {
            this.article = await getArticle(this.$route.params.articleId);
        } catch(e) {
            console.error(e);
        }
    },
    methods: {
        async saveArticle(content) {
            this.saving = true;
            try {
                const result = await updateArticle(this.article.id, { content: content });

                if(result) {
                    toast.success("Successfully saved article!");
                }
            } catch (e) {
                console.error(e);
                toast.error("Failed to save article!");

            }
            this.saving = false;
        }
    },
    components: {
        BlogEditor
    }
}

</script>