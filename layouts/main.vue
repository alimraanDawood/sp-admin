<template>
    <div class="flex flex-row w-screen h-[100dvh] overflow-hidden bg-[#FAFAFA]">
        <div class="flex flex-col h-full border-r" >
            <Sidebar v-model:expanded="expanded" v-model:mobileOpen="mobileOpen" :current="$route.meta.sidebarLink" />
        </div>

        <div class="flex flex-col h-full w-full">
            <div class="flex flex-row w-full items-center p-3 border-b gap-3" >
                <button @click="toggleSidebar">
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

            <div class="flex flex-col w-full overflow-y-scroll h-full">
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
            expanded: true && this.$viewport.isGreaterThan('tablet'),
            mobileOpen: false,
        }
    },
    components: {
        Sidebar
    },
    computed: {
        breadcrumbs() {
            return this.$route.meta.breadcrumbs;
        }
    },
    methods: {
        toggleSidebar() {
            if(this.$viewport.isGreaterThan('tablet')) {
                this.expanded = !this.expanded;
            } else {
                this.mobileOpen = !this.mobileOpen;
            }
        }
    }
}
</script>