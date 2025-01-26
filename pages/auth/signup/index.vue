<template>
    <div class="flex flex-col h-[100dvh] w-screen overflow-y-scroll overflow-x-scroll lg:p-5 items-center justify-center  bg-black/10">
        <div class="bg-white md:border md:shadow h-full md:h-fit md:rounded-lg w-full max-w-[500px] divide-y">
            <div class="flex flex-row p-3 items-center justify-between rounded-t-xl border bg-[#fafafa]">
                <button @click="$router.go(-1)" class="text-sm font-medium text-primary">Cancel</button>

                <div class="flex flex-row gap-1 items-center text-lg font-medium">
                    <PhosphorIconLock />

                    RoqiaAdmin
                </div>

                <button @click="resetFields" class="p-2 bg-primary text-white rounded">
                    <PhosphorIconArrowClockwise :size="20" weight="bold" />
                </button>
            </div>

            <div class="flex flex-col">
                <div class="flex flex-row w-full p-3 items-center gap-3">
                    <div class="h-12 aspect-square border bg-center bg-cover rounded-full grid place-items-center" :style="{ backgroundImage: `url('${ createObjectUrl(this.signUp.avatar) }')` }" >
                        <span class="font-medium text-black/50 text-lg" v-if="signUp.avatar === null">{{  signUp.name[0]  }}</span>
                    </div>
                    <div class="flex flex-row gap-1 items-center">
                        <button :disabled="signUp.avatar !== null" @click="addImage" class="text-sm font-medium px-4 p-1 border rounded disabled:opacity-50">Upload</button>
                        <button :disabled="signUp.avatar === null" @click="signUp.avatar = null" class="text-sm font-medium px-4 p-1 border rounded disabled:opacity-50">Remove</button>
                    </div>
                </div>
            </div>

            <div class="flex flex-col">
                <div class="flex flex-col gap-1 p-3">
                    <span class="font-medium text-sm">Name</span>
                    <input class="p-2 border w-full rounded-lg" v-model="v$.signUp.name.$model"
                        placeholder="John Doe" />
                    <div class="input-errors" v-for="error of v$.signUp.name.$errors" :key="error.$uid">
                        <div class="text-red-500 text-xs">{{ error.$message }}</div>
                    </div>
                </div>

                <div class="flex flex-col gap-1 p-3">
                    <span class="font-medium text-sm">Email address</span>
                    <input class="p-2 border w-full rounded-lg" v-model="v$.signUp.email.$model"
                        placeholder="john.doe@gmail.com" />
                    <div class="input-errors" v-for="error of v$.signUp.email.$errors" :key="error.$uid">
                        <div class="text-red-500 text-xs">{{ error.$message }}</div>
                    </div>
                </div>

                <div class="flex flex-col gap-1 p-3">
                    <span class="font-medium text-sm">Phone</span>
                    <PinInput class="text-sm" id="pin-input" v-model="v$.signUp.phone.$model" placeholder="○"
                        @complete="handleComplete">
                        <PinInputGroup>
                            <PinInputInput  class="p-0 w-[10%]" v-for="(id, index) in 10" :key="id" :index="index" />
                        </PinInputGroup>
                    </PinInput>
                    <div class="input-errors" v-for="error of v$.signUp.phone.$errors" :key="error.$uid">
                        <div class="text-red-500 text-xs">{{ error.$message }}</div>
                    </div>
                </div>

            </div>

            <div class="flex flex-col">
                <div class="flex flex-col p-3">
                    <span class="font-medium text-sm">Password</span>
                    <input v-model="v$.signUp.password.$model" class="p-2 border w-full rounded-lg" />
                    <div class="input-errors" v-for="error of v$.signUp.password.$errors" :key="error.$uid">
                        <div class="text-red-500 text-xs">{{ error.$message }}</div>
                    </div>
                </div>

                <div class="flex flex-col p-3">
                    <span class="font-medium text-sm">Confirm Password</span>
                    <input v-model="v$.signUp.passwordConfirm.$model" class="p-2 border w-full rounded-lg" />
                    <div class="input-errors" v-for="error of v$.signUp.passwordConfirm.$errors" :key="error.$uid">
                        <div class="text-red-500 text-xs">{{ error.$message }}</div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col w-full p-3">
                <button @click="signUpAdmin" 
                        :disabled="signUp.loading"
                        class="disabled:opacity-50 bg-primary font-medium text-white whitespace-nowrap flex flex-row items-center justify-center px-4 p-1 rounded shadow w-full">
                        <PhosphorIconSpinner v-if="signUp.loading" :size="20" class="animate-spin" />
                        <span v-else>Submit Account Request</span>
                    </button>
            </div>
        </div>
    </div>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import { required, email, minLength, sameAs } from '@vuelidate/validators';

import { signUp } from '~/services/auth';
import {
    PinInput,
    PinInputGroup,
    PinInputInput,
} from '@/components/ui/pin-input';

import { toast } from 'vue-sonner';

export default {
    setup() {
        return { v$: useVuelidate() };
    },
    data() {
        return {
            state: 'SIGNUP', // SIGNUP | VERIFICATION
            signUp: {
                name: '',
                avatar: null,
                email: '',
                phone: '07'.split(''),
                password: '',
                passwordConfirm: ''
            }
        }
    },
    validations() {
        return {
            signUp: {
                name: { required },
                email: { required, email },
                phone: { required, minLength: minLength(10) },
                password: { required },
                passwordConfirm: { required, sameAs: sameAs(this.password, 'password') }
            }
        }
    },
    computed: {
        password() {
            return this.signUp.password;
        }
    },
    methods: {
        resetFields() {
            this.v$.signUp.$reset();
            this.signUp.name = '';
            this.signUp.email = '';
            this.signUp.phone = '07'.split('');
            this.signUp.password = '';
            this.signUp.passwordConfirm = '';
        },
        createObjectUrl(object) {
            if(object) {
                return URL.createObjectURL(object);
            }
        },
        addImage() {
            // Logic to handle image upload
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    this.signUp.avatar = file;
                }
            };
            input.click();
        },
        async signUpAdmin() {
            this.v$.$validate();
            if(this.v$.$errors.length === 0) {
                try {
                    this.signUp.loading = true;
                    const user = await signUp({...this.signUp, phone: this.signUp.phone.join('')});

                    if(user) {
                        toast('Account Request Submitted!');
                        this.$router.push('/auth/verification_pending/')
                    }
                } catch(e) {
                    console.error(e);
                    toast.error('Failed to create account request! Please try again!')
                }

                this.signUp.loading = false;
            }
        }
    },
    components: {
        PinInput,
        PinInputGroup,
        PinInputInput,
    }
}
</script>