<template>
    <Dialog v-if="$viewport.isGreaterThan('tablet')" v-model:open="courierForm.open">
        <DialogTrigger>
            <slot />
        </DialogTrigger>
        <DialogContent :side="$viewport.isGreaterThan('tablet') ? 'right' : 'bottom'">
            <DialogHeader>
                <DialogTitle>Edit Courier</DialogTitle>
            </DialogHeader>

            <div class="flex flex-col w-full gap-5 p-3">
                <div class="flex flex-col gap-1">
                    <span>Courier Name</span>
                    <Input v-model="v$.courierForm.values.name.$model" />
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.courierForm.values.name.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span class="font-medium text-sm">Phone</span>
                    <PinInput class="text-sm" id="pin-input" v-model="v$.courierForm.values.phone.$model"
                        placeholder="○">
                        <PinInputGroup>
                            <PinInputInput class="p-1" v-for="(id, index) in 10" :key="id" :index="index" />
                        </PinInputGroup>
                    </PinInput>
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.courierForm.values.phone.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span class="font-medium text-sm">Plate Number</span>
                    <Input v-model="v$.courierForm.values.plateNumber.$model" />
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.courierForm.values.plateNumber.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-row gap-2 justify-end">
                    <button :disabled="courierForm.saving" @click="closeEditForm"
                        class="disabled:opacity-50 border px-4 p-1 text-sm font-medium bg-[#fafafa] rounded text-black/70">Cancel</button>
                    <button :disabled="courierForm.saving" @click="updateCourier"
                        class="disabled:opacity-50 px-4 p-1 text-sm font-medium bg-primary rounded text-white">
                        <PhosphorIconSpinner v-if="courierForm.saving" class="animate-spin" />
                        <span v-else>Save</span>
                    </button>
                </div>
            </div>
        </DialogContent>
    </Dialog>

    <Drawer v-else v-model:open="courierForm.open">
        <DrawerContent :side="$viewport.isGreaterThan('tablet') ? 'right' : 'bottom'">
            <DrawerHeader>
                <DrawerTitle>Edit Courier</DrawerTitle>
            </DrawerHeader>

            <div class="flex flex-col w-full gap-5 p-3">
                <div class="flex flex-col gap-1">
                    <span>Courier Name</span>
                    <Input v-model="v$.courierForm.values.name.$model" />
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.courierForm.values.name.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span class="font-medium text-sm">Phone</span>
                    <PinInput class="text-sm" id="pin-input" v-model="v$.courierForm.values.phone.$model"
                        placeholder="○">
                        <PinInputGroup>
                            <PinInputInput class="p-1" v-for="(id, index) in 10" :key="id" :index="index" />
                        </PinInputGroup>
                    </PinInput>
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.courierForm.values.phone.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span class="font-medium text-sm">Plate Number</span>
                    <Input v-model="v$.courierForm.values.plateNumber.$model" />
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.courierForm.values.plateNumber.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-row gap-2 justify-end">
                    <button :disabled="courierForm.saving" @click="closeEditForm"
                        class="disabled:opacity-50 border px-4 p-1 text-sm font-medium bg-[#fafafa] rounded text-black/70">Cancel</button>
                    <button :disabled="courierForm.saving" @click="updateCourier"
                        class="disabled:opacity-50 px-4 p-1 text-sm font-medium bg-primary rounded text-white">
                        <PhosphorIconSpinner v-if="courierForm.saving" class="animate-spin" />
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
import { required, minLength } from '@vuelidate/validators';

import { updateCourier } from '@/services/orders';
import { toast } from 'vue-sonner';
import { getFileUrl } from '@/services/utils';

export default {
    props: ['courier', 'isOpen'],
    emits: ['updated', 'update:isOpen'],
    setup() {
        const v$ = useVuelidate()
        return { v$ };
    },
    data() {
        return {
            courierForm: {
                open: false,
                values: {
                    name: '',
                    phone: [],
                    plateNumber: '',
                },
                saving: false
            }
        }
    },
    validations() {
        return {
            courierForm: {
                values: {
                    name: { required },
                    phone: { required, minLength: minLength(10) },
                    plateNumber: { required },
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
            this.courierForm.values = {
                name: this.courier.name,
                phone: this.courier.phone.split(''),
                plateNumber: this.courier.plateNumber,
            }
            this.courierForm.open = true;
        },

        closeEditForm() {
            this.courierForm.saving = false;
            this.courierForm.open = false;
        },

        async updateCourier() {
            this.v$.$validate();
            if (this.v$.$errors.length === 0) {
                try {
                    this.courierForm.saving = true;
                    const courier = await updateCourier(this.courier.id, { ...this.courierForm.values, phone: this.courierForm.values.phone.join('') });

                    toast.success('Successfully updated Courier!');
                    this.$emit('updated');
                } catch (e) {
                    console.error(e);
                    toast.error('Failed to update courier! Please try again!');
                }

                this.closeEditForm();
            }
        }
    },
    computed: {
        _isOpen: {
            get() {
                return this.isOpen;
            },
            set(val) {
                this.$emit('update:isOpen', val);
            }
        }
    }
}
</script>
