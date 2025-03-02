<template>
    <Dialog v-model:open="editForm.open">
        <slot />
        <DialogContent :side="$viewport.isGreaterThan('tablet') ? 'right' : 'bottom'">
            <DialogHeader>
                <DialogTitle>Edit Delivery</DialogTitle>
            </DialogHeader>

            <div class="flex flex-col w-full gap-5 p-3">
                <div class="flex flex-col gap-1">
                    <span>Location</span>
                    <Input v-model="v$.editForm.values.location.$model" />
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.editForm.values.location.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span>Cost</span>
                    <Input v-model="v$.editForm.values.cost.$model" />
                    <div class="input-errors flex flex-col mt-1" v-for="error of v$.editForm.values.cost.$errors"
                        :key="error.$uid">
                        <div
                            class="flex flex-row text-xs p-2 rounded text-red-500 font-medium bg-red-500/10 border border-red-500 items-center gap-1">
                            <PhosphorIconWarningDiamond :size="16" /> {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span>Courier</span>
                    <Select v-model="editForm.values.courier">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="Select a courier" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Couriers</SelectLabel>
                                <SelectItem v-if="couriers && couriers.length > 0" v-for="courier in couriers" :value="courier.id">
                                    <div class="flex flex-row w-full gap-2 font-medium">
                                        {{ courier.name }}
                                    </div>
                                </SelectItem>

                                <PhosphorIconSpinner v-else :size="32" weight="medium" class="animate-spin" />
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div class="flex flex-row gap-2 justify-end">
                    <button :disabled="editForm.saving" @click="closeEditForm"
                        class="disabled:opacity-50 border px-4 p-1 text-sm font-medium bg-[#fafafa] rounded text-black/70">Cancel</button>
                    <button :disabled="editForm.saving" @click="updateDelivery"
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
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { updateDelivery, getFullCouriers } from '@/services/orders';
import { toast } from 'vue-sonner';

export default {
    props: ['delivery'],
    emits: ['updated'],
    setup() {
        const v$ = useVuelidate()
        return { v$ };
    },
    data() {
        return {
            couriers: null,
            editForm: {
                open: false,
                values: {
                    location: '',
                    cost: '',
                    courier: null
                },
                saving: false
            }
        }
    },
    computed: {
        editFormOpen() {
            return this.editForm.open;
        }
    },
    async mounted() {
        this.couriers = await getFullCouriers();
        if (this.delivery) {
            this.editForm.values = {
                location: this.delivery.location,
                cost: this.delivery.cost,
                courier: this.delivery.courier
            };
        }
    },
    validations() {
        return {
            editForm: {
                values: {
                    location: { required },
                    cost: { required },
                    courier: { required }
                }
            }
        }
    },
    methods: {
        closeEditForm() {
            this.editForm.values = {
                location: '',
                cost: '',
                courier: null
            };

            this.editForm.saving = false;
            this.editForm.open = false;
        },
        async updateDelivery() {
            this.v$.$validate();
            if (this.v$.$errors.length === 0) {
                try {
                    this.editForm.saving = true;
                    const updatedDelivery = await updateDelivery(this.delivery.id, {
                        location: this.editForm.values.location,
                        cost: this.editForm.values.cost,
                        courier: this.editForm.values.courier,
                        status: 'PENDING'
                    });

                    toast.success('Successfully updated delivery!');
                    this.$emit('updated', updatedDelivery);
                    this.closeEditForm();
                } catch (e) {
                    console.error(e);
                    toast.error('Failed to update delivery!');
                }

                this.editForm.saving = false;
            }
        }
    },
    watch: {
        async editFormOpen(newVal, oldVal) {
            if (newVal) {
                this.couriers = await getFullCouriers();
                if (this.delivery) {
                    this.editForm.values = {
                        location: this.delivery.location,
                        cost: this.delivery.cost,
                        courier: this.delivery.courier
                    };
                }
            }
        }
    }
}
</script>
