<template>
    <DefineTemplate>
        <div class="flex flex-col w-full h-full divide-y">
            <div class="flex flex-row p-3 items-center gap-1">
                <div class=" bg-white border-2 border-black/10 rounded-lg grid place-items-center w-12 aspect-square">
                    <span>S</span>
                </div>

                <span class="w-full">Sports Palace</span>

                <button>
                    <PhosphorIconDotsThree :size="24" />
                </button>
            </div>

            <div class="flex flex-col h-full gap-1 p-3">
                <button v-wave @click="$router.push('/main/products/')" class="flex flex-row w-full items-center text-black/80 p-2 rounded py-1 text-sm gap-2 transition-all duration-300 ease-in-out hover:bg-black/5" :class="{ 'bg-white shadow hover:bg-white' : current === 'Products' }">
                    <PhosphorIconTag :size="18" />
                    Products
                </button>

                <button v-wave @click="$router.push('/main/products/')" class="flex flex-row w-full items-center text-black/80 p-2 rounded py-1 text-sm gap-2 transition-all duration-300 ease-in-out hover:bg-black/5" :class="{ 'bg-white shadow hover:bg-white' : current === 'Orders' }">
                    <PhosphorIconShoppingCart :size="18" />
                    Orders
                </button>

                <button v-wave @click="$router.push('/main/products/')" class="flex flex-row w-full items-center text-black/80 p-2 rounded py-1 text-sm gap-2 transition-all duration-300 ease-in-out hover:bg-black/5" :class="{ 'bg-white shadow hover:bg-white' : current === 'Inventory' }">
                    <PhosphorIconStorefront :size="18" />
                    Inventory
                </button>

                <button v-wave @click="$router.push('/main/products/')" class="flex flex-row w-full items-center text-black/80 p-2 rounded py-1 text-sm gap-2 transition-all duration-300 ease-in-out hover:bg-black/5" :class="{ 'bg-white shadow hover:bg-white' : current === 'Customers' }">
                    <PhosphorIconUsersThree :size="18" />
                    Customers
                </button>

                <button v-wave @click="$router.push('/main/products/')" class="flex flex-row w-full items-center text-black/80 p-2 rounded py-1 text-sm gap-2 transition-all duration-300 ease-in-out hover:bg-black/5" :class="{ 'bg-white shadow hover:bg-white' : current === 'Promotions' }">
                    <PhosphorIconTicket :size="18" />
                    Promotions
                </button>

            </div>

            <div class="flex flex-col  gap-1 p-3 ">
                <button v-wave @click="$router.push('/main/products/')" class="flex flex-row w-full items-center text-black/80 p-2 rounded py-1 text-sm gap-2 transition-all duration-300 ease-in-out hover:bg-black/5" :class="{ 'bg-white shadow hover:bg-white' : current === 'Promotions' }">
                    <PhosphorIconTicket :size="18" />
                    Settings
                </button>

                <div class="flex flex-row p-2 py-1 items-center gap-3">
                    <div class=" bg-white border-2 border-black/10 rounded-lg grid place-items-center w-8 text-sm aspect-square">
                        <span>A</span>
                    </div>
    
                    <span class="w-full text-sm">Al-imraan Dawood</span>
    
                    <button>
                        <PhosphorIconDotsThree :size="24" />
                    </button>
                </div>
            </div>
        </div>
    </DefineTemplate>

    <div v-if="$viewport.isGreaterThan('tablet')" class="flex flex-col h-full w-[100000px] max-w-[256px] transition-all duration-300 ease-in-out delay-0" :class="{ '!max-w-0 delay-300' : !expanded }">
        <div class="flex flex-col h-full transition-all duration-100 ease-in-out delay-300" :class="{ 'opacity-0 delay-0': !expanded }">
            <ReuseTemplate />
        </div>
    </div>

    <XyzTransition mode="out-in">
        <div v-if="!$viewport.isGreaterThan('tablet') && isMobileOpen" class="flex flex-col p-3 fixed top-0 left-0 h-[100dvh] w-screen ">
            <div xyz="fade" class="xyz-nested bg-black/70 z-10 fixed top-0 left-0 w-full h-full" @click="isMobileOpen = false"></div>
            <div xyz="fade left" class="xyz-nested max-w-[356px] w-[85vw] bg-[#FAFAFA] overflow-hidden h-full p-1 rounded-xl z-30">
                <ReuseTemplate />
            </div>
        </div>
    </XyzTransition>


    

</template>

<script setup>
import { createReusableTemplate } from '@vueuse/core'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

const props = defineProps(['current', 'expanded']);
const emits = defineEmits(['update:expanded']);

const isMobileOpen = computed({
    get() { return props.expanded },
    set(value) { emits('update:expanded', value) }
})
</script>