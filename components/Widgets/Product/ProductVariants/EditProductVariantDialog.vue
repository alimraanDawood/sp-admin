<template>
	<Dialog v-model:open="isOpen">
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Update Variant</DialogTitle>
			</DialogHeader>

			<div class="flex flex-col w-full gap-5 p-3">
				<div class="flex flex-col gap-2">
					<div class="flex flex-row border w-full p-3 gap-1">
						<div class="flex flex-row items-center gap-1">
							<PhosphorIconCoins :size="18" class="text-black/50" />
							<span class="font-medium text-black/70">Cost</span>
						</div>
						<div class="flex flex-row w-full items-center justify-end">
							<CurrencyInput v-model="_variantDetails.cost" :options="{ currency: 'UGX' }" />
						</div>
					</div>

					<div class="flex flex-row border w-full p-3 gap-1">
						<div class="flex flex-row items-center gap-1">
							<PhosphorIconCurrencyDollar :size="18" class="text-black/50" />
							<span class="font-medium text-black/70">Price</span>
						</div>
						<div class="flex flex-row w-full items-center justify-end">
							<CurrencyInput v-model="_variantDetails.price" :options="{ currency: 'UGX' }" />
						</div>
					</div>

					<div class="flex flex-row border w-full p-3 gap-1">
						<div class="flex flex-row items-center gap-1">
							<PhosphorIconStorefront :size="18" class="text-black/50" />
							<span class="font-medium text-black/70">Stock</span>
						</div>
						<div class="flex flex-row w-full items-center justify-end">
							<input v-model="_variantDetails.stock" type="number"
								class="bg-transparent text-right w-full text-black/50 font-medium focus:outline-none" />
						</div>
					</div>

					<div class="flex flex-row border w-full p-3 gap-1">
						<div class="flex flex-row items-center gap-1 w-full">
							<span class="font-medium text-black/70">Allow Backorder</span>
						</div>
						<div class="flex flex-row w-full items-center justify-end">
							<Switch :checked="_variantDetails.allowBackorder" @update:checked="val => this._variantDetails.allowBackorder = val" />
						</div>
					</div>

					<div class="flex flex-row border w-full p-3 gap-1">
						<div class="flex flex-row items-center gap-1 w-full">
							<span class="font-medium text-black/70">Manage Inventory</span>
						</div>
						<div class="flex flex-row w-full items-center justify-end">
							<Switch :checked="_variantDetails.manageInventory" @update:checked="val => this._variantDetails.manageInventory = val" />
						</div>
					</div>

					<div class="flex flex-col border w-full p-3 gap-1">
						<div class="flex flex-row items-center gap-1 w-full">
							<span class="font-medium text-black/70">Media</span>
							<button @click="$router.push(`/main/products/${product.id}/media/variant/${variant.id}`)" class="ml-auto text-sm text-black/70 bg-black/5 font-medium border px-4 p-1">Manage</button>
						</div>
						<div class="flex flex-row w-full items-center flex-wrap gap-2">
							<div class="bg-primary w-8 aspect-square rounded bg-center bg-cover" :style="{ backgroundImage: `url('${getFileUrl(variant, image, { thumb: '50x50' })}')` }" v-for="image in variant.media"></div>
						</div>
					</div>

				</div>
			</div>

			<DialogFooter>
				<div class="flex flex-col lg:flex-row lg:justify-end w-full gap-1">
					<DialogClose>
						<button class="bg-black/5 text-sm font-medium px-4 p-1 rounded shadow w-full lg:w-fit">Cancel</button>
	
					</DialogClose>
					<button @click="updateVariant" :disabled="updating" class="disabled:opacity-50 bg-primary text-white text-sm font-medium px-4 p-1 rounded shadow w-full lg:w-fit">
						<PhosphorIconSpinner v-if="updating" class="animate-spin" :size="20" />
						<span v-else>Update</span>
					</button>
				</div>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<script>
import CurrencyInput from '~/components/CurrencyInput/CurrencyInput.vue';
import { updateProductVariant } from '~/services/products';

import { toast } from 'vue-sonner';
import { getFileUrl } from '~/services/utils';

export default {
	props: ['variant', 'open', 'product'],
	emits: ['update:open', 'updated'],
	data() {
		return {
			_variantDetails: {
				price: 0,
				cost: 0,
				stock: 0,
				allowBackorder: false,
				manageInventory: false
			},
			updating: false
		}
	},
	mounted() {
	},
	computed: {
		isOpen: {
			get() { return this.open; },
			set(val) {
				if(val) {
					this.price = this.variant.price;
					this.cost = this.variant.cost;
					this.stock = this.variant.stock;
					this.allowBackorder = this.variant.allowBackorder;
					this.manageInventory = this.variant.manageInventory;
				}
				this.$emit('update:open', val);
			}
		}
	},
	watch: {
		variant(variant, oldVal) {
			console.log(variant)
			if(variant) {
				this._variantDetails.price = variant.price;
				this._variantDetails.cost = variant.cost;
				this._variantDetails.stock = variant.stock;
				this._variantDetails.allowBackorder = variant.allowBackorder;
				this._variantDetails.manageInventory = variant.manageInventory;
			}
		}
	},
	methods: {
		getFileUrl,
		async updateVariant() {
			try {
				this.updating = true;
				const result = await updateProductVariant(this.variant.id, { ...this.variant, ...this._variantDetails });
				console.log({ ...this._variantDetails })
				if(result) {
					toast.success("Successfully updated variant!");
					this.$emit('updated');
					this.isOpen = false;
				}
			} catch(e) {
				console.error(e);
				toast.error("Unable to update variant! Try again later!")
			}

			this.updating = false;
		}
	},
	components: {
		CurrencyInput
	}
}
</script>