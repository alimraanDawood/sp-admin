<template>
    <div class="flex flex-col h-[100dvh] w-screen bg-black/5 justify-center items-center">
        <div class="flex flex-col h-full md:h-fit w-full md:max-w-[500px]">
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

            <div class="flex flex-col w-full p-3 gap-5 bg-white h-full md:h-fit">
                <span class="text-center font-medium text-lg">Sign in to your admin account</span>

                <div class="flex flex-col gap-1">
                    <span class="font-medium text-sm">Email address</span>
                    <input class="p-2 border-2 w-full rounded-lg" v-model="v$.auth.email.$model"
                        placeholder="john.doe@gmail.com" />
                    <div class="input-errors" v-for="error of v$.auth.email.$errors" :key="error.$uid">
                        <div class="text-red-500 text-xs">{{ error.$message }}</div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span class="font-medium text-sm">Password</span>
                    <div class="border-2 flex flex-row gap-2 rounded-lg focus-within:border-primary">

                        <input :type="auth.passwordVisible ? 'text' : 'password' " class="p-2 focus:outline-none w-full rounded-lg" v-model="v$.auth.password.$model"
                            placeholder="***********" />

                        <button class="p-2" @click="auth.passwordVisible = !auth.passwordVisible">
                            <PhosphorIconEye      v-if="auth.passwordVisible" :size="20" />
                            <PhosphorIconEyeSlash v-else :size="20" />
                        </button>
                    </div>
                    <div class="input-errors" v-for="error of v$.auth.password.$errors" :key="error.$uid">
                        <div class="text-red-500 text-xs">{{ error.$message }}</div>
                    </div>
                </div>

                <div class="flex flex-row w-full justify-between items-center">
                    <div class="flex flex-row text-sm font-medium items-center gap-1">
                        <Checkbox />
                        Remember Me
                    </div>

                    <button class="font-medium underline text-primary text-sm">Forgot Password</button>
                </div>

                <button @click="signAdminIn" 
                    :disabled="loading"
                    class="disabled:opacity-50 bg-primary font-medium text-white whitespace-nowrap flex flex-row items-center justify-center px-4 p-1 rounded shadow w-full">
                    <PhosphorIconSpinner v-if="loading" :size="20" class="animate-spin" />
                    <span v-else>Sign In</span>
                </button>

                <div class="flex flex-col gap-2 w-full">
                    <div class="flex flex-row w-full text-black/30 gap-2 whitespace-nowrap items-center">
                        <div class="bg-black/30 h-[1px] w-full"></div>
                        Or sign in with
                        <div class="bg-black/30 h-[1px] w-full"></div>
                    </div>
                    
                    <div class="flex flex-row items-center gap-2 justify-center">
                        <button :disabled="true" @click="signInWithGoogle" class="border bg-black/5 p-2 rounded-lg">
                            <svg class="w-6" viewBox="-0.5 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </g></svg>
                        </button>
                    </div>
                </div>

                <div class="flex flex-col items-center font-medium mt-auto text-center text-sm gap-1">
                    <span>No Account? <NuxtLink class="font-medium underline text-primary" to="/auth/signup">Request an account instead</NuxtLink></span>
                    <span>By continuing, you acknowledge and agree to RoqiaAdmin's <span class="font-medium underline text-primary">Terms of service</span> and <span class="font-medium underline text-primary">Privacy Policy</span></span>
                </div>
            </div>


        </div>
    </div>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import { required, email, minLength, sameAs } from '@vuelidate/validators';

import { signIn, signUpWithGoogle } from '~/services/auth';
import { toast } from 'vue-sonner';
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
            },
            loading: false
        }
    },
    validations() {
        return {
            auth: {
                email: { required, email },
                password: { required }
            }
        }
    },
    methods: {
        resetFields() {
            this.v$.auth.$reset();
            this.auth.email = '';
            this.auth.password = '';
        },
        async signAdminIn() {
            this.v$.$validate();
            if(this.v$.$errors.length === 0) {
                try {
                    this.loading = true;
                    const user = await signIn(this.auth.email, this.auth.password);

                    if(user) {
                        toast.success('Login successful');
                        this.$router.push('/main/products');
                    } else {
                        toast.error('Invalid email or password');
                    }
                } catch (e) {
                    console.error(e);
                    if (e.response && e.response.status === 400) {
                        toast.error('Invalid email or password');
                    } else if (e.response && e.response.status === 403) {
                        toast.error('Account not verified');
                    } else {
                        toast.error('An unexpected error occurred');
                    }
                }
                this.loading = false;
            }
        },

        async signInWithGoogle() {
            try {
                const user = await signUpWithGoogle();
                if (user) {
                    toast.success('Login successful');
                    this.$router.push('/main/products');
                } else {
                    toast.error('Google sign-in failed');
                }
            } catch (e) {
                console.error(e);
                toast.error('An unexpected error occurred during Google sign-in');
            }
        }
    }
}
</script>