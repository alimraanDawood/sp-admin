<template>
    <div class="flex flex-col h-[100dvh] p-5 items-center  bg-black/10">
        <div class="bg-white border shadow rounded-lg px-1 w-full max-w-[500px] divide-y">
            <div class="flex flex-col">
                <div class="flex flex-col lg:flex-row lg:items-center gap-2 p-3">
                    <div class="flex flex-col w-full">
                        <div class="flex flex-row font-semibold items-center gap-1">
                            <PhosphorIconUser :size="18" class="text-black/70" />

                            Profile Information
                        </div>
                        <span class="text-sm text-black/70">Enter your details to request for permission!</span>
                    </div>
                </div>
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
                            <PinInputInput  class="p-1" v-for="(id, index) in 10" :key="id" :index="index" />
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
                        class="disabled:opacity-50 bg-primary font-medium text-white whitespace-nowrap px-4 p-1 rounded shadow w-full">
                        <PhosphorIconSpinner v-if="signUp.loading" :size="20" class="animate-spin" />
                        <span v-else>Submit</span>
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
                name: 'Al-imraan Dawood',
                avatar: null,
                email: 'alimraandawoodgulam@gmail.com',
                phone: '0740895974'.split(''),
                password: 'alimraanD12',
                passwordConfirm: 'alimraanD12'
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
                        toast('Account Request Submitted!')
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