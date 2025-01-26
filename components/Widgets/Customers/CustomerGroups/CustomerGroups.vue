<template>
    <div class="w-full flex flex-col shadow overflow-hidden rounded-lg">
        <div class="flex bg-white items-center gap-3 flex-row border rounded-t-lg p-5">
            <span class="text-lg font-medium">Customer Groups</span>

            <div class="ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <button class="hover:bg-black/10 rounded-lg p-1 transition-all duration-400 ease-in-out">
                            <PhosphorIconDotsThree :size="24" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem @click="$router.push(`/main/customers/${customer.id}/groups/`)">
                            <PhosphorIconPlus :size="14" /> Add
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <div class="flex flex-col bg-white divide-y border-x border-b rounded-b-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Group Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead><!-- Actions --></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow class="cursor-pointer" @click="$router.push(`/main/customers/groups/${group.id}`)"
                        v-for="group in groups" :key="group.id">
                        <TableCell class="font-medium">
                            <div class="flex flex-row items-center gap-2">
                                <span>{{ group.name }}</span>
                            </div>
                        </TableCell>
                        <TableCell>{{ group.description }}</TableCell>
                        <TableCell class="text-center">
                            <Dialog>
                                <DialogTrigger @click="e => e.stopPropagation()" as-child>
                                    <button class="p-1">
                                        <PhosphorIconTrash :size="20" />
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Are you sure you want to remove this group?</DialogTitle>
                                        <DialogDescription>This action cannot be reversed!</DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter class="flex flex-row gap-2 justify-end">
                                        <DialogClose class="w-full">
                                            <button class="bg-[#fafafa] hover:bg-black/5 w-full px-4 p-1 rounded shadow border">Cancel</button>
                                        </DialogClose>
                                        <DialogClose class="w-full">
                                            <button @click="removeGroupFromCustomer(group.id)"
                                                class="bg-primary font-medium text-white w-full whitespace-nowrap px-4 p-1 rounded shadow">Remove</button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </div>
</template>

<script>
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

import { updateCustomerGroup, getCustomerGroupsForCustomer } from '@/services/customers';
import { toast } from 'vue-sonner';

export default {
    props: ['customer'],
    emits: ['updated'],
    setup() {
        const v$ = useVuelidate();
        return { v$ };
    },
    data() {
        return {
            groups: []
        };
    },
    async mounted() {
        this.groups = await getCustomerGroupsForCustomer(this.customer.id);
    },
    validations() {
        return {
            editForm: {
                values: {
                    name: { required },
                    cover: { required }
                }
            }
        };
    },
    components: {
        Sheet,
        SheetContent,
        SheetDescription,
        SheetHeader,
        SheetTitle,
        SheetTrigger,
    },
    methods: {
        async removeGroupFromCustomer(groupId) {
            try {
                const result = await updateCustomerGroup(groupId, { 'customers-': [this.customer.id] });

                if (result) {
                    toast.success('Successfully removed group!');
                    this.$emit('updated');
                }
            } catch (e) {
                toast.error('Failed to remove group! Please try again');
            }
        }
    }
};
</script>
