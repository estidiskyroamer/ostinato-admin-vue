<script setup lang="ts">
import { Schedule } from '@/interfaces/schedule'
import { Table as TableType } from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import PageNavigation from '@/components/PageNavigation.vue'
import { Loader2 } from 'lucide-vue-next'
import { FlexRender } from '@tanstack/vue-table'

import ScheduleDialog from '../dialogs/ScheduleDialog.vue'

defineProps<{
  table: TableType<Schedule>
  refresh: () => void
  isFormDataLoading: boolean
  isLoading: boolean
}>()
</script>
<template>
  <div class="flex items-center justify-between py-4">
    <Input
      class="w-1/4"
      placeholder="Find by student name..."
      :model-value="table.getColumn('student')?.getFilterValue() as string"
      @update:model-value="table.getColumn('student')?.setFilterValue($event)"
    />
    <ScheduleDialog :refresh="refresh" :disabled="isFormDataLoading">
      <Button :disabled="isFormDataLoading"><Plus />New Schedule</Button>
    </ScheduleDialog>
  </div>
  <PageNavigation :table="table" />
  <Table>
    <TableHeader>
      <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <TableHead v-for="header in headerGroup.headers" :key="header.id"
          ><FlexRender :render="header.column.columnDef.header" :props="header.getContext()"
        /></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-if="isLoading">
        <TableRow>
          <TableCell colSpan="{columns.length}" class="items-center justify-center"
            ><Loader2 class="w-4 h-4 mr-2 animate-spin"
          /></TableCell>
        </TableRow>
      </template>
      <template v-else>
        <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
          <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id"
            ><FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()"
          /></TableCell>
        </TableRow>
      </template>
    </TableBody>
  </Table>
</template>
