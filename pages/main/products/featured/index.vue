<template>
    <div class="flex flex-col w-full h-full p-3">
        <div class="flex flex-col bg-white w-full max-h-full">
            <div class="flex flex-row p-3 border rounded-t-xl">
                <span class="text-lg lg:text-2xl font-medium">Products Groups</span>

                <div class="flex flex-row ml-auto gap-2">
                    <Dialog v-model:open="dialogs.createGroup.isOpen">
                        <DialogTrigger as-child>
                            <button v-wave
                                class="bg-primary text-sm font-medium text-white flex flex-row gap-2 px-4 p-2 rounded-lg items-center">
                                <PhosphorIconPlusCircle :size="18" weight="bold" />
                                Create
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Featured Product Group</DialogTitle>
                            </DialogHeader>

                            <div class="flex flex-col p-3">
                                <Input v-model="dialogs.createGroup.title" placeholder="Enter new title" />
                            </div>

                            <DialogFooter>
                                <div class="flex flex-row justify-end w-full gap-3">
                                    <button @click="cancelCreateGroupDialog"
                                        class="px-4 p-1 bg-[#fafafa] hover:bg-black/5 rounded text-sm">Cancel</button>
                                    <button @click="createGroup" :disabled="dialogs.editTitle.loading"
                                        class="disabled:opacity-50 px-4 p-1 bg-primary text-white font-medium rounded text-sm">
                                        <PhosphorIconSpinner v-if="dialogs.editTitle.loading" :size="20"
                                            class="animate-spin" />
                                        <span v-else>Create</span>
                                    </button>
                                </div>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div v-if="groups" class="flex flex-col w-full border-x">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="">
                                Title
                            </TableHead>
                            <TableHead>Products</TableHead>

                            <TableHead>
                                <!-- Actions -->
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow class="cursor-pointer" v-for="group in groups">
                            <TableCell class="font-medium">
                                <div class="flex flex-row items-center gap-2">
                                    <span>{{ group.title }}</span>
                                </div>
                            </TableCell>
                            <TableCell>{{ group.products.length }} Products</TableCell>

                            <TableCell class="text-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <button>
                                            <PhosphorIconDotsThree :size="20" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem @click="openEditDialog(group)">Edit Title</DropdownMenuItem>
                                        <DropdownMenuItem @click="$router.push(`/main/products/featured/${group.id}`)">Edit Products</DropdownMenuItem>
                                        <DropdownMenuItem @click="openDeleteDialog(group)">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div v-else class="flex divide-y flex-col w-full border-x">
                <div class="p-4 flex flex-row" v-for="i in 10">
                    <div class="h-12 flex flex-row w-full bg-black/10 rounded-lg animate-pulse"></div>
                </Div>
            </div>

            <div class="flex flex-row p-3 border rounded-b-xl">
                <div v-if="page" class="flex flex-row items-center">
                </div>
                <div v-else class="flex flex-row items-center">
                    <div class="h-8 w-32 bg-black/5 rounded animate-pulse"></div>
                </div>
            </div>
        </div>

        <Dialog v-model:open="dialogs.editTitle.isOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Title</DialogTitle>
                </DialogHeader>

                <div class="flex flex-col p-3">
                    <Input v-model="dialogs.editTitle.title" placeholder="Enter new title" />
                </div>

                <DialogFooter>
                    <div class="flex flex-row justify-end w-full gap-3">
                        <button @click="cancelEditDialog"
                            class="px-4 p-1 bg-[#fafafa] hover:bg-black/5 rounded text-sm">Cancel</button>
                        <button @click="updateEditDialog" :disabled="dialogs.editTitle.loading"
                            class="disabled:opacity-50 px-4 p-1 bg-primary text-white font-medium rounded text-sm">
                            <PhosphorIconSpinner v-if="dialogs.editTitle.loading" :size="20" class="animate-spin" />
                            <span v-else>Update</span>
                        </button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="dialogs.deleteGroup.isOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>

                <DialogFooter>
                    <div class="flex flex-row justify-end w-full gap-3">
                        <button @click="dialogs.deleteGroup.isOpen = false"
                            class="px-4 p-1 bg-[#fafafa] hover:bg-black/5 rounded text-sm">Cancel</button>
                        <button @click="deleteGroup" :disabled="dialogs.editTitle.loading"
                            class="disabled:opacity-50 px-4 p-1 bg-primary text-white font-medium rounded text-sm">
                            <PhosphorIconSpinner v-if="dialogs.editTitle.loading" :size="20" class="animate-spin" />
                            <span v-else>Delete</span>
                        </button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script>
import { getFeaturedProductGroups, updateFeaturedProductGroup, deleteFeaturedProductGroup, createFeaturedProductGroup } from '~/services/products';
import CreateGroup from '~/components/Widgets/Group/CreateGroup/CreateGroup.vue';
import { getFileUrl } from '~/services/utils';

definePageMeta({
    layout: 'main',
    breadcrumbs: [{
        label: 'Featured Groups',
        link: '/main/products/featured/'
    }],
    sidebarLink: 'Products-Featured'
})

export default {
    data() {
        return {
            groups: [],
            dialogs: {
                editTitle: {
                    id: '',
                    title: '',
                    isOpen: false,
                    loading: false
                },
                deleteGroup: {
                    id: '',
                    isOpen: false,
                    loading: false
                },
                createGroup: {
                    title: '',
                    isOpen: false,
                    loading: false
                }
            }
        }
    },
    async mounted() {
        this.groups = await getFeaturedProductGroups();
    },
    methods: {
        getFileUrl,
        async reloadGroups() {
            this.groups = await getFeaturedProductGroups();
        },
        openEditDialog(group) {
            this.dialogs.editTitle.id = group.id;
            this.dialogs.editTitle.title = group.title;
            this.dialogs.editTitle.isOpen = true;
        },
        cancelEditDialog() {
            this.dialogs.editTitle.id = '';
            this.dialogs.editTitle.title = '';
            this.dialogs.editTitle.isOpen = false;
        },
        openDeleteDialog(group) {
            this.dialogs.deleteGroup.id = group.id;
            this.dialogs.deleteGroup.isOpen = true;
        },
        async deleteGroup() {
            try {
                this.loading = true;
                const result = await deleteFeaturedProductGroup(this.dialogs.deleteGroup.id);
            } catch (e) {
                console.error(e);
            } finally {
                this.loading = false;
                this.dialogs.deleteGroup.isOpen = false;
                this.reloadGroups();
            }
        },
        async updateEditDialog() {
            try {
                this.loading = true;
                const result = await updateFeaturedProductGroup(this.dialogs.editTitle.id, { title: this.dialogs.editTitle.title });
            } catch (e) {
                console.error(e);
            } finally {
                this.loading = false;
                this.cancelEditDialog();
                this.reloadGroups();
            }
        },
        cancelCreateGroupDialog() {
            this.dialogs.createGroup.isOpen = false;
            this.dialogs.createGroup.title = '';
        },
        async createGroup() {
            try {
                this.dialogs.createGroup.loading = true;
                const result = await createFeaturedProductGroup(this.dialogs.createGroup.title);
            } catch (e) {
                console.error(e);
            } finally {
                this.dialogs.createGroup.loading = false;
                this.dialogs.createGroup.isOpen = false;
                this.reloadGroups();
            }
        }
    },
    components: {
        CreateGroup
    }
}
</script>