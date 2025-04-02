<script setup lang="ts">
import Header from '@/components/Header.vue';
import PageNavigation from '@/components/PageNavigation.vue';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { FlexRender } from "@tanstack/vue-table";
import { Dashboard } from './Dashboard';
import { Loader2 } from 'lucide-vue-next';
import { toDate } from "reka-ui/date";

const { table, columns, currentDate, isLoading } = Dashboard();
</script>

<template>
    <main class="flex flex-col h-screen w-full items-center">
      <Header />    
      <Card class="w-full">
        <CardHeader>
            <CardTitle class="text-xl">{{ $d(toDate(currentDate), 'short', 'id-ID') }}</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
        </Card>
    </main>
</template>