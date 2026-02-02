<template>
  <div v-if="article" class="flex flex-col gap-3 w-full p-3 h-full">
    <div class="bg-muted text-sm text-muted-foreground flex flex-row items-center p-3 w-fit gap-3 rounded border py-1">
      <span>Actions: </span>
      <Button @click="publishLinkedInArticle" :disabled="linkedInLoading"
              class="disabled:opacity-50 bg-primary text-primary-foreground p-3 py-1 rounded-lg ml-auto flex flex-row items-center gap-1">
        <PhosphorIconLinkedinLogo v-if="!linkedInLoading"/>
        <PhosphorIconSpinner v-else class="animate-spin"/>
        Publish To LinkedIn
      </Button>
    </div>
    <BlogEditor :saving="saving" @save="saveArticle" :content="article?.content"/>
  </div>
</template>

<script>
import BlogEditor from '~/components/Widgets/Blog/BlogEditor/BlogEditor.vue';
import {getArticle, postLinkedInPost, updateArticle} from '@/services/blog';
import {toast} from 'vue-sonner';

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
      saving: false,
      linkedInLoading: false
    }
  },
  async mounted() {
    try {
      this.article = await getArticle(this.$route.params.articleId);
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    async publishLinkedInArticle() {
      this.linkedInLoading = true;
      try {
        const result = await postLinkedInPost(this.article);

        console.log(result);
        toast.success("LinkedIn Post Processing started!");
      } catch (e) {
        console.error(e);
        toast.error("Failed to publish article!")
      }
      this.linkedInLoading = false;
    },
    async saveArticle(content) {
      this.saving = true;
      try {
        const result = await updateArticle(this.article.id, {content: content});

        if (result) {
          toast.success("Successfully saved article!");
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to save article!");

      }
      this.saving = false;
    },

  },
  components: {
    BlogEditor
  }
}

</script>