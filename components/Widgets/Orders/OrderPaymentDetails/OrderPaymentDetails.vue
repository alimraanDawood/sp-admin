<template>
    <div class=" w-full flex flex-col shadow overflow-hidden rounded-lg ">
        <div class="flex bg-white items-center gap-3 flex-row border rounded-t-lg px-5 p-3">
            <span class="text-lg font-medium">Payment Details</span>

            <div class="ml-auto">
                <button class="hover:bg-black/10 rounded-lg p-1 transition-all duration-400 ease-in-out">
                    <PhosphorIconDotsThree :size="24" />
                </button>
            </div>
        </div>

        <div class="flex flex-col bg-white divide-y border-x border-b runded-b-lg">
            
            <div class="gap-3 flex flex-row w-full p-5 py-3">
                <div class="flex flex-col w-full text-left">
                    <span>Registered Name</span>
                </div>

                <div class="flex flex-col w-full text-right">
                    <div class="" >
                        {{ order.expand.paymentOption.registered_name }}
                    </div>
                </div>
            </div>

            <div class="gap-3 flex flex-row w-full p-5 py-3">
                <div class="flex flex-col w-full text-left">
                    <span>Phone</span>
                </div>

                <div class="flex flex-col w-full text-right">
                    <a :href="`TEL:${order.expand.paymentOption.phone}`" class="text-primary underline" target="_blank">
                        {{ order.expand.paymentOption.phone }}
                    </a>
                </div>
            </div>

            <div class="flex flex-col w-full p-5 py-3 gap-5">
                <div class="flex flex-col" v-if="order.paymentStatus === 'PENDING'">
                    <span>Has the customer paid?</span>
                    <ConfirmDialog   title="Verify Payment" description="Are you sure you want to verify this payment?" @onConfirm="verifyPayment">
                        <template #trigger>
                            <button :disabled="verifying" v-wave class="flex flex-row disabled:animate-pulse px-4 bg-primary/10 border border-primary rounded gap-2 text-sm border font-medium text-primary p-1">
                                <span v-if="verifying">Verifying</span>
                                <span v-else >Verify Payment</span>
    
                                <PhosphorIconSpinner v-if="verifying" :size="20" class="animate-spin" />
                            </button>
                        </template>
    
                        <template #body>
                            <div class="flex flex-row items-center gap-1">
                                <Switch :checked="sendNotification" @update:checked="e => this.sendNotification = e" />
                                <span class="font-medium text-black/70">Send Notification to customer.</span>        
                            </div>
                        </template>
                    </ConfirmDialog>
                </div>

                <div class="flex flex-col" v-if="order.paymentStatus === 'COMPLETED'">
                    <span>Undo payment Verification</span>
                    <ConfirmDialog   title="Unverify Payment" description="Are you sure you want to undo verification of this payment?" @onConfirm="unverifyPayment">
                        <template #trigger>
                            <button :disabled="verifying" v-wave class="flex flex-row disabled:animate-pulse px-4 bg-primary/10 border border-primary rounded gap-2 text-sm border font-medium text-primary p-1">
                                <span v-if="verifying">Verifying</span>
                                <span v-else >Unverify Payment</span>
    
                                <PhosphorIconSpinner v-if="verifying" :size="20" class="animate-spin" />
                            </button>
                        </template>
    
                        <template #body>
                            
                        </template>
                    </ConfirmDialog>
                </div>

                <div class="flex flex-col">
                    <span>Send an email to the customer directing them on how to pay.</span>
                    <button @click="sendPaymentGuide" :disabled="sendingGuide" v-wave class="flex flex-row disabled:animate-pulse px-4 bg-primary/10 border border-primary rounded gap-2 text-sm border font-medium text-primary p-1 w-fit">
                        <span v-if="sendingGuide">Sending</span>
                        <span v-else >Send Payment Guide</span>
    
                        <PhosphorIconSpinner v-if="sendingGuide" :size="20" class="animate-spin" />
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import ConfirmDialog from '~/components/Misc/ConfirmDialog.vue';
import { updateOrder, sendPaymentConfirmationNotification, sendPaymentGuideNotification } from '~/services/orders';

import { toast } from 'vue-sonner';

export default {
    props: ['order'],
    emits: ['updated'],
    data() {
        return {
            sendNotification: true,
            verifying: false,
            sendingGuide: false,
        }
    },
    components: {
        ConfirmDialog
    },
    methods: {
        async verifyPayment() {
            this.verifying = true;
            
            try {
                const result = await updateOrder(this.order.id, { paymentStatus: 'COMPLETED' });

                if(result) {
                    toast.success("Successfully updated order!");
                    if(this.sendNotification) {
                        await sendPaymentConfirmationNotification(this.order.id);
                        toast.success("Successfully Sent Notification!");
                    }
                }

                this.$emit('updated', true);
            } catch(e) {
                console.error(e);

                toast.error("Something went wrong!")
            }

            this.verifying = false;
        },

        async unverifyPayment() {
            this.verifying = true;
            
            try {
                const result = await updateOrder(this.order.id, { paymentStatus: 'PENDING' });

                if(result) {
                    toast.success("Successfully updated order!");
                    
                }

                this.$emit('updated', true);
            } catch(e) {
                console.error(e);

                toast.error("Something went wrong!")
            }

            this.verifying = false;
        },

        async sendPaymentGuide() {
            this.sendingGuide = true;
            
            try {
                await sendPaymentGuideNotification(this.order.id);
                toast.success("Successfully Sent Notification!");
            } catch(e) {
                console.error(e);

                toast.error("Something went wrong!")
            }

            this.sendingGuide = false;
        }
    }
}
</script>