<script setup lang="ts">
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue'
import { computed, ref } from 'vue'
import { getProductGroups } from '~/services/products';
import { getFileUrl } from '~/services/utils';
const groups = await getProductGroups();

const props = defineProps(['groups']);
const emit = defineEmits(['update:groups']);

const modelValue = computed({
    get() {
        return props.groups;
    },
    set(value) {
        emit('update:groups', value);
    }
})
const open = ref(false)
const searchTerm = ref('')

const filteredGroups = computed(() => groups.filter(i => !modelValue.value.find(j => j.id === i.id)))
</script>

<template>
  <TagsInput class="px-0 gap-0 w-full" v-model="modelValue">
    <div class="flex gap-2 flex-wrap items-center px-3">
      <TagsInputItem class="bg-primary text-white" v-for="item in modelValue" :key="item.id" :value="item.name">
        <TagsInputItemText />
        <TagsInputItemDelete @click="modelValue.splice(modelValue.indexOf(item), 1)" />
      </TagsInputItem>
    </div>

    <ComboboxRoot v-model="modelValue" v-model:open="open" v-model:search-term="searchTerm" class="w-full">
      <ComboboxAnchor as-child>
        <ComboboxInput placeholder="Select Product Groups" as-child>
          <TagsInputInput class="w-full px-3" :class="modelValue.length > 0 ? 'mt-2' : ''" @keydown.enter.prevent />
        </ComboboxInput>
      </ComboboxAnchor>

      <ComboboxPortal>
        <ComboboxContent>
          <CommandList
            position="popper"
            class=" z-50 w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            <CommandEmpty />
            <CommandGroup>
              <CommandItem
                v-for="group in filteredGroups" :key="group.id" :value="group"
                @select.prevent="(ev) => {
                    console.log(ev.detail.value);
                  if (ev.detail) {
                    searchTerm = ''
                    modelValue.push(ev.detail.value)
                  }

                  if (filteredGroups.length === 0) {
                    open = false
                  }
                }"
              >
              <div class="flex flex-row items-center gap-1">
                <div class="h-4 bg-primary aspect-square rounded bg-cover bg-center" :style="{ backgroundImage: `url('${getFileUrl(group, group.cover, { thumb: '15x15' })}')` }"></div>
                {{ group.name }}
              </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </TagsInput>
</template>
