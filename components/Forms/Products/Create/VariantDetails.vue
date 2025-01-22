<template>
  <Table>
    <TableCaption>A list of your recent invoices.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead class="border">
          {{ options.map((option) => option.name).join(' / ') }}
        </TableHead>
        <TableHead class="border text-center w-64">Allow Back Order</TableHead>
        <TableHead class="border text-center w-64">Manage Inventory</TableHead>
        <TableHead class="border text-right w-44">
          Price
        </TableHead>
        <TableHead class="border text-right w-44">
          Stock
        </TableHead>
        <TableHead class="border text-center">
          Media
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="variant in variants">
        <TableCell class="font-medium border">
          {{ variant.options.map((option) => option.value).join(' / ') }}
        </TableCell>
        <TableCell class="text-center">
          <Checkbox :checked="variant.allowBackOrder" @update:checked="(val) => variant.allowBackOrder = val" />
        </TableCell>
        <TableCell class="text-center border">
          <Checkbox :checked="variant.manageInventory" @update:checked="(val) => variant.manageInventory = val" />
        </TableCell>
        <TableCell class="text-right border focus-within:bg-blue-100">
          <div class="flex flex-row items-center">
            <PhosphorIconCoins :size="18" class="text-black/50" />
            <CurrencyInput v-model="variant.price" :options="{ currency: 'UGX' }" />
          </div>
        </TableCell>
        <TableCell class="text-right border focus-within:bg-blue-100">
          <div class="flex flex-row items-center">
            <PhosphorIconPackage :size="18" class="text-black/50" />
            <input v-model="variant.stock" type="number"
              class="bg-transparent text-right w-full text-black/50 font-medium focus:outline-none" />
          </div>
        </TableCell>

        <TableCell class="text-center border ">
          <div v-wave class="flex flex-row items-center justify-center">

            <AddMedia v-model="variant.media" />
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script>
import { mapStores } from 'pinia';
import { useProductStore } from '@/stores/product';
import CurrencyInput from '~/components/CurrencyInput/CurrencyInput.vue';
import AddMedia from '~/components/Forms/Products/Create/Dialogs/AddMedia.vue';

import { useDropZone } from '@vueuse/core';
import { ref } from 'vue';

export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapStores(useProductStore),
    variants() {
      return this.productStore.create.forms.details.variants;
    },
    options() {
      return this.productStore.create.forms.details.variantOptions;
    }
  },
  methods: {
    formatPrice(variant) {
      variant.price = parseFloat(variant.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    addMedia() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/jpeg';
      input.multiple = true;
      input.onchange = (event) => {
        const files = Array.from(event.target.files);
        onDrop(files);
      };
      input.click();
    },
    
  },
  components: {
    CurrencyInput,
    AddMedia
  }

}
</script>