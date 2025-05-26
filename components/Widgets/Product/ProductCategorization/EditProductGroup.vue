<template>
    <Dialog v-if="$viewport.isGreaterThan('tablet')" v-model:open="isOpen">
        <DialogTrigger>
            <slot />
        </DialogTrigger>

        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Product Groups</DialogTitle>
                <DialogDescription>Edit groups for product: <b>{{ product.name }}</b></DialogDescription>
            </DialogHeader>

            <DialogContent class="flex flex-col max-h-[85vh] h-full">
                <div class="flex flex-col w-full h-full gap-3">
                    <div class="flex flex-row w-full gap-2 border p-2">
                        <Search class="text-muted-foreground" />

                        <input v-model="query" class="w-full border-none outline-none" placeholder="Search groups" />
                    </div>

                    <div class="flex flex-col p-1 overflow-y-hidden w-full h-full border">
                      <div class="flex flex-col h-full w-full overflow-y-scroll">
                        <div v-for="group in filteredGroups" :key="group.id" class="flex flex-row w-full p-2 items-center gap-2">
                            <Checkbox :checked="selectedGroupIds.includes(group.id)" @update:checked="v => toggleGroup(group.id)" />

                            <span>{{ group.name }}</span>
                        </div>
                      </div>
                    </div>
                </div>

                <DialogFooter>
                    <div class="flex flex-row w-full justify-end gap-2">
                        <Button variant="outline" @click="isOpen = false">Cancel</Button>
                        <Button @click="updateGroups" :disabled="updating">
                            <PhosphorIconSpinner v-if="updating" class="animate-spin" :size="20" />
                            <span v-else>Submit</span>
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </DialogContent>
    </Dialog>
  <Drawer v-else v-model:open="isOpen">
    <DrawerTrigger>
      <slot />
    </DrawerTrigger>

    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Edit Product Groups</DrawerTitle>
        <DrawerDescription>Edit groups for product: <b>{{ product.name }}</b></DrawerDescription>
      </DrawerHeader>

      <DrawerContent class="flex flex-col h-[75vh]">
        <div class="flex flex-col w-full h-full gap-3 p-3 overflow-y-hidden">
          <div class="flex flex-row w-full gap-2 border p-2">
            <Search class="text-muted-foreground" />

            <input v-model="query" class="w-full border-none outline-none" placeholder="Search groups" />
          </div>

          <div class="flex flex-col p-1  w-full h-full border overflow-y-scroll">
            <div v-for="group in filteredGroups" :key="group.id" class="flex flex-row w-full p-2 items-center gap-2">
              <Checkbox :checked="selectedGroupIds.includes(group.id)" @update:checked="v => toggleGroup(group.id)" />

              <span>{{ group.name }}</span>
            </div>
          </div>
        </div>

        <DrawerFooter>
          <div class="flex flex-row w-full justify-end gap-2">
            <Button variant="outline" @click="isOpen = false">Cancel</Button>
            <Button @click="updateGroups" :disabled="updating">
              <PhosphorIconSpinner v-if="updating" class="animate-spin" :size="20" />
              <span v-else>Submit</span>
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </DrawerContent>
  </Drawer>

</template>

<script setup>
import { Search } from 'lucide-vue-next';
import { getProductGroups, getProductGroupsFromProduct, updateProductGroup } from '~/services/products';
import { toast } from 'vue-sonner';

const props = defineProps({
    product: {
        type: Object,
        required: true
    },
    open: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:open', 'updated']);

const isOpen = computed({
    get() { return props.open; },
    set(val) {
        emit('update:open', val);
    }
});

const { data: groups } = await useAsyncData(() => {
    return getProductGroups();
});

const query = ref('');
const updating = ref(false);
const selectedGroupIds = ref([]);

// Get the product's current groups when component is mounted
onMounted(async () => {
    await loadProductGroups();
});

watch('open', async (val) => {
  if(val) {
    await loadProductGroups();
  }
})

const loadProductGroups = async () => {
    try {
        const productGroups = await getProductGroupsFromProduct(props.product.id);

        selectedGroupIds.value = productGroups.map(group => group.id);
    } catch (e) {
        console.error(e);
        toast.error("Failed to load product groups! Try again later!");
    }
};

const filteredGroups = computed(() => {
    if (!groups.value) return [];

    if (query.value === "") {
        return groups.value;
    } else {
        return groups.value.filter(g => g.name.toLowerCase().includes(query.value.toLowerCase()));
    }
});

const updateGroups = async () => {
    try {
        updating.value = true;

        // Get all groups
        const allGroups = groups.value;
        // Get current product groups
        const currentProductGroups = await getProductGroupsFromProduct(props.product.id);
        const currentGroupIds = currentProductGroups.map(group => group.id);

        // Groups to add the product to
        const groupsToAdd = selectedGroupIds.value.filter(id => !currentGroupIds.includes(id));
        // Groups to remove the product from
        const groupsToRemove = currentGroupIds.filter(id => !selectedGroupIds.value.includes(id));

        // Add product to selected groups
        for (const groupId of groupsToAdd) {
            await updateProductGroup(groupId, { 'products+': [props.product.id] });
        }

        // Remove product from unselected groups
        for (const groupId of groupsToRemove) {
            await updateProductGroup(groupId, { 'products-': [props.product.id] });
        }

        toast.success("Successfully updated product groups!");
        emit('updated');
        isOpen.value = false;
    } catch (e) {
        console.error(e);
        toast.error("Failed to update product groups! Try again later!");
    } finally {
        updating.value = false;
    }
};

const toggleGroup = (groupId) => {
  if(selectedGroupIds.value.includes(groupId)) {
    selectedGroupIds.value = selectedGroupIds.value.filter((g) => g !== groupId)
  } else {
    selectedGroupIds.value.push(groupId);
  }
}
</script>
