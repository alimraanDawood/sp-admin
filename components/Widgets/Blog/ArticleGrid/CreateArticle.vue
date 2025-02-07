<template>
    <Sheet v-model:open="editForm.open">
        <SheetTrigger>
            <button v-wave
                    class="bg-primary text-sm font-medium text-white flex flex-row gap-2 px-4 p-2 rounded-lg items-center">
                <PhosphorIconPlusCircle :size="18" weight="bold" />
                Create 
            </button>
        </SheetTrigger>
        <SheetContent :side="$viewport.isGreaterThan('tablet') ? 'right' : 'bottom' ">
            <SheetHeader>
                <SheetTitle>Create Article</SheetTitle>
            </SheetHeader>

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
        </SheetContent>
    </Sheet>
</template>

<script>

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';


import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

import { createArticle } from '@/services/blog';
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
            editForm: {
                open: false,
                values: {
                    title: '',
                    cover: null
                },
                saving: false
            }
        }
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
        Sheet,
        SheetContent,
        SheetDescription,
        SheetHeader,
        SheetTitle,
        SheetTrigger,
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
                cover: this.article.cover
            }
            this.editForm.open = true;
        },

        closeEditForm() {
            this.editForm.values = {
                title: '',
                content: '',
                cover: null
            };

            this.editForm.saving = false;
            this.editForm.open = false;
        },
        async createArticle() {
            this.v$.$validate();
            if(this.v$.$errors.length === 0) {
                try {
                    this.editForm.saving = true;
                    const article = await createArticle({title: this.editForm.values.title, content: '', cover: this.editForm.values.cover, date: new Date() });

                    toast.success('Successfully created article!');
                    this.$emit('updated');
                    this.closeEditForm();
                } catch(e) {
                    console.error(e);
                    toast.error('Failed to create article!');
                }

                this.editForm.saving = false;
            }
        }
    }
}

</script>
