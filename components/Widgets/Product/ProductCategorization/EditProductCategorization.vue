<template>
	<Dialog v-model:open="isOpen">
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Update Product Categorization</DialogTitle>
			</DialogHeader>

            <div class="flex flex-col gap-1">

                <div class="flex flex-col">
                    <span>Tags</span>

                    <TagsInput v-model="tags">
						<TagsInputItem class="bg-primary text-white font-medium" v-for="tag in tags" :key="tag" :value="tag">
							<TagsInputItemText />
							<TagsInputItemDelete />
						</TagsInputItem>

						<TagsInputInput placeholder="Product Tags..." />
					</TagsInput>
                </div>

            </div>

			<DialogFooter>
				<div class="flex flex-col lg:flex-row lg:justify-end w-full gap-1">
					<DialogClose>
						<button class="bg-black/5 text-sm font-medium px-4 p-1 rounded shadow w-full lg:w-fit">Cancel</button>	
					</DialogClose>
					<button @click="updateCategorization" :disabled="updating" class="disabled:opacity-50 bg-primary text-white text-sm font-medium px-4 p-1 rounded shadow w-full lg:w-fit">
						<PhosphorIconSpinner v-if="updating" class="animate-spin" :size="20" />
						<span v-else>Update</span>
					</button>
				</div>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<script>
import { updateProduct, getProductGroupsFromProduct, updateProductGroup } from '~/services/products';

import { toast } from 'vue-sonner';

import SelectGroup from '~/components/Forms/Products/Create/SelectGroup.vue';

export default {
	props: ['groups', 'open', 'product'],
	emits: ['update:open', 'updated'],
	data() {
		return {
			updating: false,
            _groups: [],
            tags: []
		}
	},
	mounted() {
		this.tags = this.product.tags.split(',');
	},
	computed: {
		isOpen: {
			get() { return this.open; },
			set(val) {
				this.$emit('update:open', val);
			}
		}
	},
	
	methods: {
		async reloadProductCategorizationDetails() {
			try {
			this.tags = this.product.tags.split(',');
			this.groups = await getProductGroupsFromProduct(this.product.id);

			} catch(e) {
				console.error(e);
				toast.error("Failed to load product groups! Try again later!")
			}
		},

		async updateCategorization() {
			try {
				this.updating = true;

				const result = await updateProduct(this.product.id, { tags: this.tags.join(',') });
				this.$emit('updated');

				this.isOpen = false;
				toast.success("Successfully updated Product!")
			} catch(e) {
				console.error(e);
				toast.error("Failed to update product! Try again later!")
			}

			this.updating = false;
		}
	},
	components: {
		SelectGroup
	}
}
</script>