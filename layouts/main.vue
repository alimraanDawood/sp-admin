<template>
    <div class="flex flex-row w-screen h-[100dvh] bg-[#FAFAFA]">
        <div class="flex flex-col h-full border-r" >
            <Sidebar v-model:expanded="expanded" :current="$route.meta.sidebarLink" />
        </div>

        <div class="flex flex-col h-full w-full">
            <div class="flex flex-row w-full items-center p-3 border-b gap-3" >
                <button @click="expanded = !expanded">
                    <PhosphorIconSidebarSimple :size="24" />
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

                <button class="ml-auto">
                    <PhosphorIconBell :size="24" />
                </button>

            </div>

            <div class="flex flex-col w-full h-full">
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '~/components/Sidebar/Sidebar.vue';
export default {
    data() {
        return { 
            expanded: true && this.$viewport.isGreaterThan('tablet')
        }
    },
    components: {
        Sidebar
    },
    computed: {
        breadcrumbs() {
            return this.$route.meta.breadcrumbs;
        }
    }
}
</script>