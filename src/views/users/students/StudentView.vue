<script setup lang="ts">
import PageNavigation from '@/components/PageNavigation.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FlexRender } from '@tanstack/vue-table'
import { Loader2, Plus } from 'lucide-vue-next'
import { Student } from './Student'
import StudentDialog from './dialogs/StudentDialog.vue'

const { table, isLoading, getStudents } = Student()
</script>

<template>
  <div class="flex items-center justify-between py-4">
    <Input
      class="w-1/4"
      placeholder="Find by name..."
      :model-value="table.getColumn('name')?.getFilterValue() as string"
      @update:model-value="table.getColumn('name')?.setFilterValue($event)"
    />
    <StudentDialog :refresh="getStudents"
      ><Button>
        <Plus />
        New Student
      </Button></StudentDialog
    >
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
