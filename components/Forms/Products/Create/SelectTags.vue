<script setup lang="ts">
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue'
import { computed, ref } from 'vue'
import { getProductTags } from '~/services/products';

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
</script>

<template>
  <TagsInput class=" gap-2 w-full" v-model="modelValue">
      <TagsInputItem class="bg-primary text-white" v-for="item in modelValue" :key="item" :value="item">
        <TagsInputItemText />
        <TagsInputItemDelete @click="modelValue.splice(modelValue.indexOf(item), 1)" />
      </TagsInputItem>
      <TagsInputInput class="w-full px-3" :class="modelValue.length > 0 ? 'mt-2' : ''" @keydown.enter.prevent />
  </TagsInput>
</template>