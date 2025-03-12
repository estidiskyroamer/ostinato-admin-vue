<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ChevronFirst, ChevronLeft, ChevronRight, ChevronLast, EllipsisVertical } from 'lucide-vue-next'
import { Table } from '@tanstack/vue-table';
interface PaginationProps {
    table: Table<any>   
}
defineProps<PaginationProps>()
</script>


<template>
    <div class="flex flex-row w-full items-center justify-center">
        <Button size="icon" variant="ghost" :disabled="!table.getCanPreviousPage()"  @click="table.setPageIndex(0)"><ChevronFirst /></Button>
        <Button size="icon" variant="ghost" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()"><ChevronLeft /></Button>
        <span>Page {{ table.getState().pagination.pageIndex + 1 }} of {{ table.getPageCount() }}</span>
        <Button size="icon" variant="ghost" :disabled="!table.getCanNextPage()" @click="table.nextPage()"><ChevronRight /></Button>
        <Button size="icon" variant="ghost" :disabled="!table.getCanNextPage()" @click="table.setPageIndex(table.getPageCount() - 1)"><ChevronLast /></Button>
    </div>
</template>