<template>
    <Dialog @update:open="resetIfOpen" v-if="$viewport.isGreaterThan('tablet')" v-model:open="authorForm.open">
        <DialogTrigger>
            <button v-wave
                class="bg-primary text-sm font-medium text-white flex flex-row gap-2 px-4 p-2 rounded-lg items-center">
                <PhosphorIconPlusCircle :size="18" weight="bold" />
                Create
            </button>
        </DialogTrigger>
        <DialogContent :side="$viewport.isGreaterThan('tablet') ? 'right' : 'bottom'">
            <DialogHeader>
                <DialogTitle>Create Author</DialogTitle>
            </DialogHeader>

            <div class="flex flex-col w-full gap-5 p-3">
                <div class="flex flex-col gap-1">
                    <span>Author Name</span>
                    <Input class="!border-2 !border-black/50" v-model="v$.authorForm.values.name.$model" />
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.authorForm.values.name.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span>Title</span>
                    <Input class="!border-2 !border-black/50" v-model="v$.authorForm.values.title.$model" />
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.authorForm.values.title.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span>Bio</span>
                    <textarea class="!border-2 !border-black/50" v-model="v$.authorForm.values.bio.$model"></textarea>
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.authorForm.values.bio.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span>Profile Picture</span>
                    <input type="file" @change="onFileChange" />
                </div>

                <div class="flex flex-row gap-2 justify-end">
                    <button :disabled="authorForm.saving" @click="closeEditForm"
                        class="disabled:opacity-50 border px-4 p-1 text-sm font-medium bg-[#fafafa] rounded text-black/70">Cancel</button>
                    <button :disabled="authorForm.saving" @click="createAuthor"
                        class="disabled:opacity-50 px-4 p-1 text-sm font-medium bg-primary rounded text-white">
                        <PhosphorIconSpinner v-if="authorForm.saving" class="animate-spin" />
                        <span v-else>Save</span>
                    </button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
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
import { required, minLength } from '@vuelidate/validators';

import { createAuthor } from '@/services/blog';
import { toast } from 'vue-sonner';
import { getFileUrl } from '@/services/utils';

export default {
    props: ['group'],
    emits: ['updated'],
    setup() {
        const v$ = useVuelidate()
        return { v$ };
    },
    data() {
        return {
            authorForm: {
                open: false,
                values: {
                    name: '',
                    title: '',
                    bio: '',
                    profile_picture: null
                },
                saving: false
            }
        }
    },
    validations() {
        return {
            authorForm: {
                values: {
                    name: { required },
                    title: { required },
                    bio: { required, minLength: minLength(10) },
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

        onFileChange(event) {
            const file = event.target.files[0];
            this.authorForm.values.profile_picture = file;
        },

        openEditForm() {
            this.authorForm.values = {
                name: this.group.name,
                title: this.group.title,
                bio: this.group.bio,
                profile_picture: this.group.profile_picture
            }
            this.authorForm.open = true;
        },

        closeEditForm() {
            this.authorForm.values = {
                name: '',
                title: '',
                bio: '',
                profile_picture: null
            };

            this.authorForm.saving = false;
            this.authorForm.open = false;
        },

        resetIfOpen() {
            if (this.authorForm.open) {
                this.authorForm = {
                    open: false,
                    values: {
                        name: '',
                        title: '',
                        bio: '',
                        profile_picture: null
                    },
                    saving: false
                }
                this.v$.$reset();
            }
        },

        async createAuthor() {
            this.v$.$validate();
            if (this.v$.$errors.length === 0) {
                try {
                    this.authorForm.saving = true;
                    const formData = new FormData();
                    formData.append('name', this.authorForm.values.name);
                    formData.append('title', this.authorForm.values.title);
                    formData.append('bio', this.authorForm.values.bio);
                    formData.append('profile_picture', this.authorForm.values.profile_picture);

                    await createAuthor(formData);

                    toast.success('Successfully created Author!');
                    this.$emit('updated');
                    this.resetIfOpen();
                } catch (e) {
                    console.error(e);
                    toast.error('Failed to create author! Please try again!');
                }

                this.authorForm.saving = false;
            }
        }
    }
}
</script>
