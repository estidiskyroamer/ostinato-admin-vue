<script setup lang="ts">
import Header from '@/components/Header.vue';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronFirst, ChevronLeft, ChevronRight, ChevronLast, EllipsisVertical } from 'lucide-vue-next'
import { Teacher } from './Teacher';
import PageNavigation from '@/components/PageNavigation.vue';
import { FlexRender } from "@tanstack/vue-table";
import { Loader2 } from 'lucide-vue-next'

const { table, columns, isLoading } = Teacher();
</script>

<template>
    <PageNavigation :table="table" />
    <Table>
        <TableHeader>
            <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id"><FlexRender :render="header.column.columnDef.header" :props="header.getContext()" /></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <template v-if="isLoading">
                <TableRow>
                    <TableCell colSpan={columns.length} class="items-center justify-center"><Loader2 class="w-4 h-4 mr-2 animate-spin" /></TableCell>
                </TableRow>
            </template>
            <template v-else>
                <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
                    <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id"><FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" /></TableCell>
                </TableRow>
            </template>            
        </TableBody>
    </Table>
</template>