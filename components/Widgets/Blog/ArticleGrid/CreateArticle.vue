<template>
    <Dialog v-model:open="editForm.open">
        <DialogTrigger>
            <button v-wave
                class="bg-primary text-sm font-medium text-white flex flex-row gap-2 px-4 p-2 rounded-lg items-center">
                <PhosphorIconPlusCircle :size="18" weight="bold" />
                Create
            </button>
        </DialogTrigger>
        <DialogContent :side="$viewport.isGreaterThan('tablet') ? 'right' : 'bottom'">
            <DialogHeader>
                <DialogTitle>Create Article</DialogTitle>
            </DialogHeader>

            <div class="flex flex-col w-full gap-5 p-3">
                <div class="flex flex-col gap-1">
                    <span>Article Title</span>
                    <Input v-model="v$.editForm.values.title.$model" />
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.editForm.values.title.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span>Cover Image</span>
                    <div v-if="typeof v$.editForm.values.cover.$model === typeof ''"
                        class="flex flex-row p-2 border rounded-lg">
                        <div class="flex flex-col w-12 bg-primary aspect-square rounded bg-cover bg-center"
                            :style="{ backgroundImage: `url('${getFileUrl(this.article, v$.editForm.values.cover.$model, { thumb: '50x50' })}')` }">
                        </div>

                        <div class="flex flex-row items-center ml-auto gap-1">
                            <button class="p-1 border text-black/50 rounded">
                                <PhosphorIconEye :size="18" />
                            </button>

                            <button @click="v$.editForm.values.cover.$model = null"
                                class="p-1 border text-black/50 rounded">
                                <PhosphorIconTrash :size="18" />
                            </button>
                        </div>
                    </div>

                    <button @click="addImage" v-else-if="v$.editForm.values.cover.$model === null"
                        class="flex flex-row p-2 gap-2 border rounded-lg items-center justify-center text-black/50">
                        <PhosphorIconUpload :size="18" />
                        Upload Image
                    </button>

                    <div v-else class="flex flex-row p-2 border rounded-lg">
                        <div class="flex flex-col w-12 bg-primary aspect-square rounded bg-cover bg-center"
                            :style="{ backgroundImage: `url('${createObjectURL(v$.editForm.values.cover.$model)}')` }">
                        </div>

                        <div class="flex flex-row items-center ml-auto gap-1">
                            <button class="p-1 border text-black/50 rounded">
                                <PhosphorIconEye :size="18" />
                            </button>

                            <button @click="v$.editForm.values.cover.$model = null"
                                class="p-1 border text-black/50 rounded">
                                <PhosphorIconTrash :size="18" />
                            </button>
                        </div>
                    </div>
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.editForm.values.cover.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>

                    <div class="flex flex-col gap-1">
                        <span>Type</span>
                        <Select v-model="editForm.values.type">
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Select an article type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Types</SelectLabel>
                                    <SelectItem v-for="type in ['Article', 'News', 'Insights', 'History', 'Opportunity']" :value="type">
                                        <div class="flex flex-row w-full gap-2 font-medium">
                                            {{ type }}
                                        </div>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="flex flex-col gap-1">
                        <span>Categories</span>
                        <CategoryInput v-model:categories="editForm.values.categories" />
                    </div>

                    <div class="flex flex-col gap-1">
                        <span>Author</span>
                        <Select v-model="editForm.values.author">
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Select an author" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Authors</SelectLabel>
                                    <SelectItem v-for="author in authors" :value="author.id">
                                        <div class="flex flex-row w-full gap-2 font-medium">
                                            <div class="bg-primary h-5 aspect-square rounded-full bg-center bg-cover" :style="{ backgroundImage: `url('${getFileUrl(author, author.profile_picture, { thumb: '50x50' })}')` }"></div>
                                            {{ author.name }}
                                        </div>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div class="flex flex-row gap-2 justify-end">
                    <button :disabled="editForm.saving" @click="closeEditForm"
                        class="disabled:opacity-50 border px-4 p-1 text-sm font-medium bg-[#fafafa] rounded text-black/70">Cancel</button>
                    <button :disabled="editForm.saving" @click="createArticle"
                        class="disabled:opacity-50 px-4 p-1 text-sm font-medium bg-primary rounded text-white">
                        <PhosphorIconSpinner v-if="editForm.saving" class="animate-spin" />
                        <span v-else>Save</span>
                    </button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script>

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import CategoryInput from './CategoryInput.vue';

import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

import { createArticle, getFullAuthors } from '@/services/blog';
import { toast } from 'vue-sonner';
import { getFileUrl } from '@/services/utils';

export default {
    props: ['article'],
    emits: ['updated'],
    setup() {
        const v$ = useVuelidate()
        return { v$ };
    },
    data() {
        return {
            authors: null,
            editForm: {
                open: false,
                values: {
                    title: '',
                    cover: null,
                    categories: [],
                    author: null,
                    type: 'Article'
                },
                saving: false
            }
        }
    },
    async mounted() {
        this.authors = await getFullAuthors();
    },
    validations() {
        return {
            editForm: {
                values: {
                    title: { required },
                    cover: { required }
                }
            }
        }
    },
    components: {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
        CategoryInput,
        Select,
        SelectContent,
        SelectGroup,
        SelectItem,
        SelectLabel,
        SelectTrigger,
        SelectValue,
    },
    methods: {
        getFileUrl,
        createObjectURL(file) {
            return URL.createObjectURL(file);
        },
        addImage() {
            // Logic to handle image upload
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (event) => {
                const file = event.target.files[0];
                if (file) {
                    this.editForm.values.cover = file;
                }
            };
            input.click();
        },
        openEditForm() {
            this.editForm.values = {
                title: this.article.title,
                content: this.article.content,
                cover: this.article.cover,
                categories: this.article.categories,
                author: this.article.author
            }
            this.editForm.open = true;
        },

        closeEditForm() {
            this.editForm.values = {
                title: '',
                content: '',
                cover: null,
                categories: [],
                author: null
            };

            this.editForm.saving = false;
            this.editForm.open = false;
        },
        async createArticle() {
            this.v$.$validate();
            if (this.v$.$errors.length === 0) {
                try {
                    this.editForm.saving = true;
                    const article = await createArticle({ title: this.editForm.values.title, content: '', cover: this.editForm.values.cover, date: new Date(), categories: [...this.editForm.values.categories.map((cat) => cat.id)], authors: [this.editForm.values.author], category: this.editForm.values.type });

                    toast.success('Successfully created article!');
                    this.$emit('updated');
                    this.closeEditForm();
                } catch (e) {
                    console.error(e);
                    toast.error('Failed to create article!');
                }

                this.editForm.saving = false;
            }
        }
    }
}

</script>
