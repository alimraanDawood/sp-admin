<template>
    <div class=" w-full flex flex-col shadow overflow-hidden rounded-lg ">
        <div class="flex bg-white items-center gap-3 flex-row border rounded-t-lg p-5">
            <div class="flex flex-col w-8 bg-primary aspect-square rounded bg-cover bg-center"
                :style="{ backgroundImage: `url('${getFileUrl(this.group, this.group.cover, { thumb: '50x50' })}')` }">
            </div>
            <span class="text-lg font-medium">{{ group.name }}</span>

            <div class="ml-auto">
                <Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <button class="hover:bg-black/10 rounded-lg p-1 transition-all duration-400 ease-in-out">
                                <PhosphorIconDotsThree :size="24" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem @click="openEditForm">
                                <PhosphorIconPencilSimple :size="14" /> Edit
                            </DropdownMenuItem>
                            <DialogTrigger as-child>
                                <DropdownMenuItem>
                                    <PhosphorIconTrashSimple :size="14" /> Delete
                                </DropdownMenuItem>
                            </DialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
                            <DialogDescription>This action cannot be reversed!</DialogDescription>
                        </DialogHeader>

                        <DialogFooter class="flex flex-row gap-2 justify-end">
                            <DialogClose class="w-full"><button
                                    class="bg-[#fafafa] hover:bg-black/5 w-full px-4 p-1 rounded shadow border">Cancel</button>
                            </DialogClose>
                            <button @click="deleteProductGroup"
                                class="bg-primary font-medium text-white w-full whitespace-nowrap px-4 p-1 rounded shadow">Delete</button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>

        <div class="flex flex-col bg-white divide-y border-x border-b runded-b-lg">
            <div class="gap-3 grid grid-cols-2 p-5 py-3">
                <span>Description</span>

                <span>{{ group.description }}</span>
            </div>
        </div>
    </div>

    <!-- Edit Form -->
    <Sheet v-model:open="editForm.open">
        <SheetContent :side="$viewport.isGreaterThan('tablet') ? 'right' : 'bottom' ">
            <SheetHeader>
                <SheetTitle>Edit Group</SheetTitle>
            </SheetHeader>

            <div class="flex flex-col w-full gap-5 p-3">
                <div class="flex flex-col gap-1">
                    <span>Group Name</span>
                    <Input v-model="v$.editForm.values.name.$model" />
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.editForm.values.name.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span>Group Description (optional)</span>
                    <Textarea v-model="editForm.values.description" />
                </div>

                <div class="flex flex-col gap-1">
                    <span>Group Cover</span>
                    <div v-if="typeof v$.editForm.values.cover.$model === typeof ''"
                        class="flex flex-row p-2 border rounded-lg">
                        <div class="flex flex-col w-12 bg-primary aspect-square rounded bg-cover bg-center"
                            :style="{ backgroundImage: `url('${getFileUrl(this.group, v$.editForm.values.cover.$model, { thumb: '50x50' })}')` }">
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
                </div>

                <div class="flex flex-row gap-2 justify-end">
                    <button :disabled="editForm.saving" @click="closeEditForm"
                        class="disabled:opacity-50 border px-4 p-1 text-sm font-medium bg-[#fafafa] rounded text-black/70">Cancel</button>
                    <button :disabled="editForm.saving" @click="saveProductGroupDetails"
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
import { required, minLength, helpers } from '@vuelidate/validators';

import { updateProductGroup, deleteProductGroup } from '@/services/products';
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
            editForm: {
                open: false,
                values: {
                    name: '',
                    description: '',
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
                    name: { required },
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
                name: this.group.name,
                description: this.group.description,
                cover: this.group.cover
            }
            this.editForm.open = true;
        },

        closeEditForm() {
            this.editForm.values = {
                name: '',
                cover: null
            };

            this.editForm.saving = false;
            this.editForm.open = false;
        },

        async saveProductGroupDetails() {
            this.v$.$validate()
            if (this.v$.$errors.length === 0) {
                try {
                    this.editForm.saving = true;
                    const group = await updateProductGroup(this.group.id, this.editForm.values);
                    this.$emit('updated');
                    toast.success('Group Details updated successfully.');
                    this.closeEditForm();
                } catch (e) {
                    console.error(e);

                    toast.error('Failed to update group. Please try again.');
                }
            }
        },

        async deleteProductGroup() {
            try {
                const deleted = await deleteProductGroup(this.group.id);

                if (deleted) {
                    toast.success('Group Details deleted successfully.');
                    this.$router.go(-1);
                }
            } catch (e) {
                console.error(e);

                toast.error('Failed to delete group. Please try again.');
            }
        }
    }
}

</script>