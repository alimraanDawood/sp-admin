<template>
    <Dialog @update:open="resetIfOpen" v-if="$viewport.isGreaterThan('tablet')" v-model:open="customerForm.open">
        <DialogTrigger>
            <button v-wave
                class="bg-primary text-sm font-medium text-white flex flex-row gap-2 px-4 p-2 rounded-lg items-center">
                <PhosphorIconPlusCircle :size="18" weight="bold" />
                Create
            </button>
        </DialogTrigger>
        <DialogContent :side="$viewport.isGreaterThan('tablet') ? 'right' : 'bottom'">
            <DialogHeader>
                <DialogTitle>Create Customer</DialogTitle>
            </DialogHeader>

            <div class="flex flex-col w-full gap-5 p-3">
                <div class="flex flex-col gap-1">
                    <span>Customer Name</span>
                    <Input v-model="v$.customerForm.values.name.$model" />
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.customerForm.values.name.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span>Email</span>
                    <Input v-model="v$.customerForm.values.email.$model" />
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.customerForm.values.email.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span class="font-medium text-sm">Phone</span>
                    <PinInput class="text-sm" id="pin-input" v-model="v$.customerForm.values.phone.$model"
                        placeholder="○">
                        <PinInputGroup>
                            <PinInputInput class="p-1" v-for="(id, index) in 10" :key="id" :index="index" />
                        </PinInputGroup>
                    </PinInput>
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.customerForm.values.phone.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span class="font-medium text-sm">Customer Tags</span>
                    <TagsInput v-model="customerForm.values.tags">
                        <TagsInputItem class="text-white bg-primary" v-for="item in customerForm.values.tags"
                            :key="item" :value="item">
                            <TagsInputItemText />
                            <TagsInputItemDelete />
                        </TagsInputItem>

                        <TagsInputInput placeholder="Customer Tags" />
                    </TagsInput>
                </div>

                <div class="flex flex-row gap-2 justify-end">
                    <button :disabled="customerForm.saving" @click="closeEditForm"
                        class="disabled:opacity-50 border px-4 p-1 text-sm font-medium bg-[#fafafa] rounded text-black/70">Cancel</button>
                    <button :disabled="customerForm.saving" @click="createProductGroup"
                        class="disabled:opacity-50 px-4 p-1 text-sm font-medium bg-primary rounded text-white">
                        <PhosphorIconSpinner v-if="customerForm.saving" class="animate-spin" />
                        <span v-else>Save</span>
                    </button>
                </div>
            </div>
        </DialogContent>
    </Dialog>

    <Drawer @update:open="resetIfOpen" v-else v-model:open="customerForm.open">
        <DrawerTrigger>
            <button v-wave
                class="bg-primary text-sm font-medium text-white flex flex-row gap-2 px-4 p-2 rounded-lg items-center">
                <PhosphorIconPlusCircle :size="18" weight="bold" />
                Create
            </button>
        </DrawerTrigger>
        <DrawerContent :side="$viewport.isGreaterThan('tablet') ? 'right' : 'bottom'">
            <DrawerHeader>
                <DrawerTitle>Create Customer</DrawerTitle>
            </DrawerHeader>

            <div class="flex flex-col w-full gap-5 p-3">
                <div class="flex flex-col gap-1">
                    <span>Customer Name</span>
                    <Input v-model="v$.customerForm.values.name.$model" />
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.customerForm.values.name.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span>Email</span>
                    <Input v-model="v$.customerForm.values.email.$model" />
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.customerForm.values.email.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span class="font-medium text-sm">Phone</span>
                    <PinInput class="text-sm" id="pin-input" v-model="v$.customerForm.values.phone.$model"
                        placeholder="○">
                        <PinInputGroup>
                            <PinInputInput class="w-[10%]" v-for="(id, index) in 10" :key="id" :index="index" />
                        </PinInputGroup>
                    </PinInput>
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.customerForm.values.phone.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span class="font-medium text-sm">Customer Tags</span>
                    <TagsInput v-model="customerForm.values.tags">
                        <TagsInputItem class="text-white bg-primary" v-for="item in customerForm.values.tags"
                            :key="item" :value="item">
                            <TagsInputItemText />
                            <TagsInputItemDelete />
                        </TagsInputItem>

                        <TagsInputInput placeholder="Customer Tags" />
                    </TagsInput>
                </div>

                <div class="flex flex-row gap-2 justify-end">
                    <button :disabled="customerForm.saving" @click="closeEditForm"
                        class="disabled:opacity-50 border px-4 p-1 text-sm font-medium bg-[#fafafa] rounded text-black/70">Cancel</button>
                    <button :disabled="customerForm.saving" @click="createProductGroup"
                        class="disabled:opacity-50 px-4 p-1 text-sm font-medium bg-primary rounded text-white">
                        <PhosphorIconSpinner v-if="customerForm.saving" class="animate-spin" />
                        <span v-else>Save</span>
                    </button>
                </div>
            </div>
        </DrawerContent>
    </Drawer>

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

import {
    PinInput,
    PinInputGroup,
    PinInputInput,
} from '@/components/ui/pin-input';


import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers, requiredIf, email } from '@vuelidate/validators';

import { createCustomer } from '@/services/customers';
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
            customerForm: {
                open: false,
                values: {
                    name: '',
                    email: '',
                    phone: [],
                    tags: [],
                    cover: null
                },
                saving: false
            }
        }
    },
    validations() {
        return {
            customerForm: {
                values: {
                    name: { required },
                    email: { required, email },
                    phone: { required, minLength: minLength(10) },
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
        PinInput,
        PinInputGroup,
        PinInputInput,
    },
    methods: {
        getFileUrl,

        openEditForm() {
            this.customerForm.values = {
                name: this.group.name,
                cover: this.group.cover
            }
            this.customerForm.open = true;
        },

        closeEditForm() {
            this.customerForm.values = {
                name: '',
                description: '',
                cover: null
            };

            this.customerForm.saving = false;
            this.customerForm.open = false;
        },

        resetIfOpen() {
            if (this.customerForm.open) {
                this.customerForm = {
                    open: false,
                    values: {
                        name: '',
                        email: '',
                        phone: [],
                        tags: [],
                        cover: null
                    },
                    saving: false
                }
                this.v$.$reset();
            }
        },

        async createProductGroup() {
            this.v$.$validate();
            if (this.v$.$errors.length === 0) {
                try {
                    this.customerForm.saving = true;
                    const customer = await createCustomer({ ...this.customerForm.values, phone: this.customerForm.values.phone.join(''), tags: this.customerForm.values.tags.join(',') });

                    toast.success('Successfully created Customer!');
                    this.$emit('updated');
                    this.resetIfOpen();
                } catch (e) {
                    console.error(e);
                    toast.error('Failed to create customer! Please try again!');
                }

                this.customerForm.saving = false;
            }
        }
    }
}

</script>
