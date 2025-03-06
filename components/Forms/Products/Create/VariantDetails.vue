<template>
	<div class="hidden lg:flex flex-col w-full">
		<Table>
			<TableCaption>A list of your recent invoices.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead class="border">
						{{ hasVariants ? options.map((option) => option.name).join(' / ') : 'DEFAULT' }}
					</TableHead>
					<TableHead class="border text-center w-64">Allow Back Order</TableHead>
					<TableHead class="border text-center w-64">Manage Inventory</TableHead>
					<TableHead class="border text-right w-44">
						Cost
					</TableHead>
					<TableHead class="border text-right w-44">
						Price
					</TableHead>
					<TableHead class="border text-right w-44">
						Stock
					</TableHead>
					<TableHead v-if="hasVariants" class="border text-center">
						Media
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow v-for="variant in variants">
					<TableCell class="font-medium border">
						{{ variant.options.map((option) => option.value).join(' / ') }}
					</TableCell>
					<TableCell class="text-center border">
						<Checkbox :checked="variant.allowBackOrder"
							@update:checked="(val) => variant.allowBackOrder = val" />
					</TableCell>
					<TableCell class="text-center border">
						<Checkbox :checked="variant.manageInventory"
							@update:checked="(val) => variant.manageInventory = val" />
					</TableCell>
					<TableCell class="text-right border focus-within:bg-blue-100">
						<div class="flex flex-row items-center">
							<PhosphorIconCoins :size="18" class="text-black/50" />
							<CurrencyInput v-model="variant.cost" :options="{ currency: 'UGX' }" />
						</div>
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
	
					<TableCell v-if="hasVariants" class="text-center border ">
						<div v-wave class="flex flex-row items-center justify-center">
	
							<AddMedia v-model="variant.media" />
						</div>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</div>

	<div class="flex lg:hidden flex-col w-full gap-4">
		<div v-for="variant in variants" class="flex flex-col">
			<div class="flex flex-row p-4 border rounded-t-xl">
				<span class="font-medium text-black/50 text-sm">{{ variant.options.map((option) => option.value).join(' / ') }}</span>
			</div>
			<div class="border flex flex-col divide-y border-t-0 rounded-b">
				<div class="flex flex-row p-3 items-center justify-between">
					<span class="font-medium">Allow Back Order</span>

					<Checkbox :checked="variant.allowBackOrder"
							@update:checked="(val) => variant.allowBackOrder = val" />
				</div>

				<div class="flex flex-row p-3 items-center justify-between">
					<span class="font-medium">Manage Inventory</span>

					<Checkbox :checked="variant.manageInventory"
							@update:checked="(val) => variant.manageInventory = val" />
				</div>

				<div class="flex flex-row w-full p-3 gap-1">
					<div class="flex flex-row items-center gap-1">
						<PhosphorIconCoins :size="18" class="text-black/50" />
						<span class="font-medium">Cost</span>
					</div>
					<div class="flex flex-row w-full items-center justify-end">
						<CurrencyInput v-model="variant.cost" :options="{ currency: 'UGX' }" />
					</div>
				</div>

				<div class="flex flex-row w-full p-3 gap-1">
					<div class="flex flex-row items-center gap-1">
						<PhosphorIconCoins :size="18" class="text-black/50" />
						<span class="font-medium">Price</span>
					</div>
					<div class="flex flex-row w-full items-center justify-end">
						<CurrencyInput v-model="variant.price" :options="{ currency: 'UGX' }" />
					</div>
				</div>

				<div class="flex flex-row p-3 gap-1 w-full">
					<div class="flex flex-row items-center gap-1">
						<PhosphorIconPackage :size="18" class="text-black/50" />
						<span class="font-medium">Stock</span>
					</div>
					<div class="flex flex-row items-center w-full justify-end">
							<input v-model="variant.stock" type="number"
								class="bg-transparent text-right w-full text-black/50 font-medium focus:outline-none" />
					</div>
				</div>

				<div class="flex flex-row p-3 gap-1 w-full">
					<div class="flex flex-row items-center gap-1">
						<PhosphorIconImage :size="18" class="text-black/50" />
						<span class="font-medium">Media</span>
					</div>
					<div class="flex flex-row items-center w-full justify-end">
						<AddMedia v-model="variant.media" />
					</div>
				</div>
			</div>
		</div>
	</div>
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
			if (this.hasVariants) {
				return this.productStore.create.forms.details.variants;
			} else {
				return [this.productStore.create.forms.details.defaultVariant]
			}
		},
		options() {
			return this.productStore.create.forms.details.variantOptions;
		},
		hasVariants() {
			return this.productStore.create.forms.details.hasVariants;
		}
	},
	methods: {
		formatPrice(variant) {
			variant.price = parseFloat(variant.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
		addMedia() {
			const input = document.createElement('input');
			input.type = 'file';
			input.accept = 'image/*';
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