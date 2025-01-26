<template>
    <div class="flex flex-col h-[100dvh] w-screen bg-black/5 justify-center items-center">
        <div class="flex flex-col h-full md:h-fit w-full md:max-w-[500px]">
            <div class="flex flex-row p-3 items-center justify-between rounded-t-xl border bg-[#fafafa]">
                <button class="text-sm font-medium text-primary">Cancel</button>

                <div class="flex flex-row gap-1 items-center text-lg font-medium">
                    <PhosphorIconLock />

                    RoqiaAdmin
                </div>

                <button class="p-2 bg-primary text-white rounded">
                    <PhosphorIconArrowClockwise :size="20" weight="bold" />
                </button>
            </div>

            <div class="flex flex-col w-full p-3 gap-2 text-center bg-white h-full items-center justify-center">
                <span class="text-center font-medium text-lg">Verification Pending!</span>
                <span>
                    Your request is under review. You will be notified when you have been granted access. If your account is already verified? Please <NuxtLink class="font-semibold underline text-primary" to="/auth">Sign In</NuxtLink>
                </span>
            </div>


        </div>
    </div>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import { required, email, minLength, sameAs } from '@vuelidate/validators';


export default {
    setup() {
        return { v$: useVuelidate() };
    },
    data() {
        return {
            auth: {
                email: '',
                password: '',
                passwordVisible: false,
            }
        }
    },
    validations() {
        return {
            auth: {
                email: { required, email },
                password: { required }
            }
        }
    }
}
</script>