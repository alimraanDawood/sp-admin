<template>
	<Dialog v-model:open="isOpen">
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Update Variant</DialogTitle>
			</DialogHeader>

			<div class="flex flex-col w-full gap-5 p-3">
				<div class="flex flex-col gap-2">
					{{ variant }}
					<div class="flex flex-row border w-full p-3 gap-1">
						<div class="flex flex-row items-center gap-1">
							<PhosphorIconCoins :size="18" class="text-black/50" />
							<span class="font-medium text-black/70">Cost</span>
						</div>
						<div class="flex flex-row w-full items-center justify-end">
							<CurrencyInput v-model="cost" :options="{ currency: 'UGX' }" />
						</div>
					</div>

					<div class="flex flex-row border w-full p-3 gap-1">
						<div class="flex flex-row items-center gap-1">
							<PhosphorIconCurrencyDollar :size="18" class="text-black/50" />
							<span class="font-medium text-black/70">Price</span>
						</div>
						<div class="flex flex-row w-full items-center justify-end">
							<CurrencyInput v-model="price" :options="{ currency: 'UGX' }" />
						</div>
					</div>

					<div class="flex flex-row border w-full p-3 gap-1">
						<div class="flex flex-row items-center gap-1">
							<PhosphorIconStorefront :size="18" class="text-black/50" />
							<span class="font-medium text-black/70">Stock</span>
						</div>
						<div class="flex flex-row w-full items-center justify-end">
							<input v-model="variant.stock" type="number"
								class="bg-transparent text-right w-full text-black/50 font-medium focus:outline-none" />
						</div>
					</div>
				</div>
			</div>

			<DialogFooter>
				<DialogClose>
					<button class="bg-black/5 text-sm font-medium px-4 p-1 rounded shadow">Cancel</button>

				</DialogClose>
				<button class="bg-primary text-white text-sm font-medium px-4 p-1 rounded shadow">Update</button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<script>
import CurrencyInput from '~/components/CurrencyInput/CurrencyInput.vue';

export default {
	props: ['variant', 'open'],
	emits: ['update:open'],
	data() {
		return {
			_variantDetails: {
				price: 0,
				cost: 0,
				stock: 0,
				allowBackorder: false,
				manageInventory: false
			}
		}
	},
	mounted() {
		console.log("I aws mounted")
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
	components: {
		CurrencyInput
	}
}
</script>