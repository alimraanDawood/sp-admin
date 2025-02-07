<template>
    <div class="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows" :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
  </template>

<script setup lang="ts">
interface Variant {
    options: any[]
}


const props = defineProps(['variantOptions', 'selected']);
const emits = defineEmits(['update:selected']);
function generateCombinations(options: any[], index = 0, currentCombination = []) : any[] {
    if (index === options.length) {
        return [currentCombination];
    }

    const combinations = [];
    for (const value of options[index].values) {
        combinations.push(
            ...generateCombinations(options, index + 1, [...currentCombination, { name: options[index].name, value }])
        );
    }

    return combinations;
}

const variants = computed(() => {
    return generateCombinations(props.variantOptions);
});

import { h } from 'vue'

import type { ColumnDef } from '@tanstack/vue-table'
import { Checkbox } from '@/components/ui/checkbox'

import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'

function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function'
    ? updaterOrValue(ref.value)
    : updaterOrValue
}


const rowSelection = ref({})

const columns = computed(() => {
    return [
                {
                    id: 'select',
                    header: ({ table }) => h(Checkbox, {
                        'checked': table.getIsAllPageRowsSelected(),
                        'onUpdate:checked': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
                        'ariaLabel': 'Select all',
                    }),
                    cell: ({ row }) => h(Checkbox, {
                        'checked': row.getIsSelected(),
                        'onUpdate:checked': (value: boolean) => row.toggleSelected(!!value),
                        'ariaLabel': 'Select row',
                    }),
                    enableSorting: false,
                    enableHiding: false,
                },
                ...props.variantOptions.map((option) => ({
                    accessorKey: option.name,
                    header: () => h('span', {}, option.name),
                    cell: ({ row }) => {
                        return h('span', {}, row.original.find((opt) => opt.name === option.name).value);
                    }
                }))
            ]
})

const table = useVueTable({
  get data() { return variants.value },
  get columns() { return columns.value },
  getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: updaterOrValue => {
        return valueUpdater(updaterOrValue, rowSelection);
    },
    state: {
        get rowSelection() { return rowSelection.value },
    },
})

watch(rowSelection, () => {
    emits('update:selected', table.getFilteredSelectedRowModel().rows.map((row) => ({ options: row.original, cost: '', price: '', stock: 0, allowBackOrder: false, manageInventory: false, media: [], thumb: null })));
}, { deep: true });

</script>