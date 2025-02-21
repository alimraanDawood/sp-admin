<script setup lang="ts">
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue'
import { computed, ref } from 'vue'
import { getFullCategories } from '~/services/blog';
import { getFileUrl } from '~/services/utils';
const categories = await getFullCategories();

const props = defineProps(['categories']);
const emit = defineEmits(['update:categories']);

const modelValue = computed({
    get() {
        return props.categories;
    },
    set(value) {
        emit('update:categories', value);
    }
})
const open = ref(false)
const searchTerm = ref('')

const filteredCategories = computed(() => categories.filter(i => !modelValue.value.find(j => j.id === i.id)))
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
        <ComboboxInput placeholder="Select Categories" as-child>
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
                v-for="category in filteredCategories" :key="category.id" :value="category"
                @select.prevent="(ev) => {
                    console.log(ev.detail.value);
                  if (ev.detail) {
                    searchTerm = ''
                    modelValue.push(ev.detail.value)
                  }

                  if (filteredCategories.length === 0) {
                    open = false
                  }
                }"
              >
              <div class="flex flex-row items-center gap-1">
                {{ category.name }}
              </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </TagsInput>
</template>
