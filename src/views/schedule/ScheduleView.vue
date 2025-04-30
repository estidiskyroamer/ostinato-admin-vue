<script setup lang="ts">
import Header from '@/components/Header.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import PageNavigation from '@/components/PageNavigation.vue'
import { Loader2 } from 'lucide-vue-next'
import { FlexRender } from '@tanstack/vue-table'
import { Calendar } from '@/components/ui/calendar'
import { Schedule } from './Schedule'

const { table, columns, currentDateRef, isLoading } = Schedule()
</script>

<template>
  <main class="flex flex-col h-screen w-full items-center">
    <Header />
    <div class="flex flex-row gap-4 w-full">
      <Card class="flex-4">
        <CardContent>
          <Calendar
            v-model="currentDateRef"
            @update:model-value="
              (v) => {
                console.log(v)
              }
            "
          />
        </CardContent>
      </Card>
      <Card class="flex-1">
        <CardHeader>
          <CardTitle class="text-xl">Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center justify-end py-4">
            <Button><Plus />New Schedule</Button>
          </div>
          <PageNavigation :table="table" />
          <Table>
            <TableHeader>
              <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                <TableHead v-for="header in headerGroup.headers" :key="header.id"
                  ><FlexRender
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
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
        </CardContent>
      </Card>
    </div>
  </main>
</template>
