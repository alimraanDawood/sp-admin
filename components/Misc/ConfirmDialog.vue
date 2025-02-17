<template>
    <Dialog v-model:open="open">
        <DialogTrigger>
            <slot name="trigger" />
        </DialogTrigger>

        <DialogContent>
            <DialogHeader>
                <DialogTitle>{{ title }}</DialogTitle>
                <DialogDescription>{{ description }}</DialogDescription>
            </DialogHeader>

            <slot name="body" />

            <DialogFooter>
                <div class="flex flex-col w-full lg:justify-end gap-3 lg:flex-row">
                    
                    <DialogClose>
                        <button class="text-sm px-4 p-1 w-full bg-black/5 lg:w-fit text-black/70 border font-medium rounded">Cancel</button>
                    </DialogClose>

                    <button @click="confirm" class="text-sm px-4 p-1 w-full lg:w-fit text-black/70 border font-medium bg-primary text-white rounded">Confirm</button>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script>
export default {
    emits: ['onConfirm'],
    props: {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            open: false
        }
    },
    methods: {
        confirm() {
            this.$emit('onConfirm');
            this.open = false;

        }
    }
}
</script>

<style scoped>
/* Add any scoped styles here */
</style>