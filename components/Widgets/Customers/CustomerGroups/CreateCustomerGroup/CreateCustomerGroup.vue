<template>
    <Sheet  v-model:open="editForm.open">
        <SheetTrigger>
            <button v-wave
                        class="bg-primary text-sm font-medium text-white flex flex-row gap-2 px-4 p-2 rounded-lg items-center">
                        <PhosphorIconPlusCircle :size="18" weight="bold" />
                        Create 
                    </button>
        </SheetTrigger>
        <SheetContent :side="$viewport.isGreaterThan('tablet') ? 'right' : 'bottom' ">
            <SheetHeader>
                <SheetTitle>Create Customer Group</SheetTitle>
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

                <div class="flex flex-row gap-2 justify-end">
                    <button :disabled="editForm.saving" @click="closeEditForm"
                        class="disabled:opacity-50 border px-4 p-1 text-sm font-medium bg-[#fafafa] rounded text-black/70">Cancel</button>
                    <button :disabled="editForm.saving" @click="createCustomerGroup"
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

import { createCustomerGroup } from '@/services/customers';
import { toast } from 'vue-sonner';

export default {
    props: ['group'],
    emits: ['updated'],
    setup() {
        const v$ = useVuelidate();
        return { v$ };
    },
    data() {
        return {
            editForm: {
                open: false,
                values: {
                    name: '',
                    description: '',
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
            this.editForm.values = {
                name: this.group.name,
                description: this.group.description
            }
            this.editForm.open = true;
        },

        closeEditForm() {
            this.editForm.values = {
                name: '',
                description: '',
            };

            this.editForm.saving = false;
            this.editForm.open = false;
        },
        async createCustomerGroup() {
            this.v$.$validate();
            if (this.v$.$errors.length === 0) {
                try {
                    this.editForm.saving = true;
                    console.log(this.editForm.values);
                    const customerGroup = await createCustomerGroup(this.editForm.values);

                    toast.success('Successfully created customer group!');
                    this.$emit('updated');
                    this.closeEditForm();
                } catch (e) {
                    console.error(e);
                    toast.error('Failed to create customer group!');
                }

                this.editForm.saving = false;
            }
        }
    }
}

</script>