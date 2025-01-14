<template>
    <div class="flex flex-row h-[100dvh] w-full bg-primary p-3">
        <div class="flex flex-col h-full w-[296px]">
            <div class="flex flex-row gap-2 items-center h-16 grow-0 px-3">
                <div class="aspect-square w-8 rounded-lg grid place-items-center bg-gray-500">
                    <span>S</span>
                </div>

                Sports Palace
            </div>

            <div class="flex flex-col h-full p-3 gap-1">
                <button v-wave class="items-center flex flex-row gap-2 p-2 px-3 text-secondary-300/60 rounded-lg" :class="currentSidebarLink === 'Products' ? '!text-secondary-300 font-medium bg-white/5' : '' ">
                    <PhosphorIconPackage :size="22" :weight="currentSidebarLink === 'Products' ? 'fill' : 'regular' " />

                    <span>Products</span>
                </button>

                <button v-wave class="items-center flex flex-row gap-2 p-2 px-3 text-secondary-300/60 rounded-lg" :class="currentSidebarLink === 'Orders' ? '!text-secondary-300 font-medium bg-white/5' : '' ">
                    <PhosphorIconShoppingCart :size="22" :weight="currentSidebarLink === 'Orders' ? 'fill' : 'regular' " />

                    <span>Orders</span>
                </button>
            </div>
        </div>
        <div class="flex flex-col h-full w-full bg-[#faf9f5] rounded-lg overflow-hidden">
            <!-- Topbar -->
            <div class="flex flex-row h-16 w-full p-3 items-center gap-3 border-b bg-white">
                <button class="text-muted-foreground hover:text-foreground transition-all duration-500 ease-in-out">
                    <PanelLeft size="20" />
                </button>
                <Breadcrumb>
                    <BreadcrumbList>
                        <template v-for="(breadcrumb, index) in breadcrumbs" :key="index">
                            <BreadcrumbItem>
                                <BreadcrumbLink>
                                    <NuxtLink :to="breadcrumb.link">{{ breadcrumb.label }}</NuxtLink>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
                        </template>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div class="flex flex-col h-full w-full">
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
import BreadcrumbPage from '~/components/ui/breadcrumb/BreadcrumbPage.vue';
import { PanelLeft, Package } from 'lucide-vue-next';

export default {
    components: {
        PanelLeft,
        Package
    },
    computed: {
        breadcrumbs() {
            return this.$route.meta.breadcrumbs;
        },
        currentSidebarLink() {
            return this.$route.meta.sidebarLink;
        }
    }
}
</script>