<script setup lang="ts">
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue'
import { computed, ref } from 'vue'
import { getProductTags } from '~/services/products';
const tags = await getProductTags();

const props = defineProps(['tags']);
const emit = defineEmits(['update:tags']);

const modelValue = computed({
    get() {
        return props.tags;
    },
    set(value) {
        emit('update:tags', value);
    }
})
const open = ref(false)
const searchTerm = ref('')

const filteredGroups = computed(() => tags.filter(i => !modelValue.value.includes(i.name)))
</script>

<template>
  <TagsInput class="px-0 gap-0 w-full" :model-value="modelValue">
    <div class="flex gap-2 flex-wrap items-center px-3">
      <TagsInputItem class="bg-primary text-white" v-for="item in modelValue" :key="item.id" :value="item.name">
        <TagsInputItemText />
        <TagsInputItemDelete @click="modelValue.splice(modelValue.indexOf(item), 1)" />
      </TagsInputItem>
    </div>

    <ComboboxRoot v-model="modelValue" v-model:open="open" v-model:search-term="searchTerm" class="w-full">
      <ComboboxAnchor as-child>
        <ComboboxInput placeholder="Select Product Tags" as-child>
          <TagsInputInput class="w-full px-3" :class="modelValue.length > 0 ? 'mt-2' : ''" @keydown.enter.prevent />
        </ComboboxInput>
      </ComboboxAnchor>

      <ComboboxPortal>
        <ComboboxContent>
          <CommandList
            position="popper"
            class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
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
                {{ group.name }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </TagsInput>
</template>