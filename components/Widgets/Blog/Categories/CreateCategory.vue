<template>
    <Dialog @update:open="resetIfOpen" v-if="$viewport.isGreaterThan('tablet')" v-model:open="categoryForm.open">
        <DialogTrigger>
            <button v-wave
                class="bg-primary text-sm font-medium text-white flex flex-row gap-2 px-4 p-2 rounded-lg items-center">
                <PhosphorIconPlusCircle :size="18" weight="bold" />
                Create
            </button>
        </DialogTrigger>
        <DialogContent :side="$viewport.isGreaterThan('tablet') ? 'right' : 'bottom'">
            <DialogHeader>
                <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>

            <div class="flex flex-col w-full gap-5 p-3">
                <div class="flex flex-col gap-1">
                    <span>Category Name</span>
                    <Input class="!border-2 !border-black/50" v-model="v$.categoryForm.values.name.$model" />
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.categoryForm.values.name.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-row gap-2 justify-end">
                    <button :disabled="categoryForm.saving" @click="closeEditForm"
                        class="disabled:opacity-50 border px-4 p-1 text-sm font-medium bg-[#fafafa] rounded text-black/70">Cancel</button>
                    <button :disabled="categoryForm.saving" @click="createCategory"
                        class="disabled:opacity-50 px-4 p-1 text-sm font-medium bg-primary rounded text-white">
                        <PhosphorIconSpinner v-if="categoryForm.saving" class="animate-spin" />
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

import { createCategory } from '@/services/blog';
import { toast } from 'vue-sonner';

export default {
    props: ['group'],
    emits: ['updated'],
    setup() {
        const v$ = useVuelidate()
        return { v$ };
    },
    data() {
        return {
            categoryForm: {
                open: false,
                values: {
                    name: '',
                },
                saving: false
            }
        }
    },
    validations() {
        return {
            categoryForm: {
                values: {
                    name: { required },
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
        openEditForm() {
            this.categoryForm.values = {
                name: this.group.name,
                description: this.group.description
            }
            this.categoryForm.open = true;
        },

        closeEditForm() {
            this.categoryForm.values = {
                name: '',
                description: ''
            };

            this.categoryForm.saving = false;
            this.categoryForm.open = false;
        },

        resetIfOpen() {
            if (this.categoryForm.open) {
                this.categoryForm = {
                    open: false,
                    values: {
                        name: '',
                        description: ''
                    },
                    saving: false
                }
                this.v$.$reset();
            }
        },

        async createCategory() {
            this.v$.$validate();
            if (this.v$.$errors.length === 0) {
                try {
                    this.categoryForm.saving = true;
                    const formData = new FormData();
                    formData.append('name', this.categoryForm.values.name);

                    await createCategory(formData);

                    toast.success('Successfully created Category!');
                    this.$emit('updated');
                    this.resetIfOpen();
                } catch (e) {
                    console.error(e);
                    toast.error('Failed to create category! Please try again!');
                }

                this.categoryForm.saving = false;
            }
        }
    }
}
</script>
