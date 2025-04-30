<script setup lang="ts">
import Header from '@/components/Header.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  ChevronFirst,
  ChevronLeft,
  ChevronRight,
  ChevronLast,
  EllipsisVertical,
} from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Student } from './Student'
import { Plus } from 'lucide-vue-next'
import PageNavigation from '@/components/PageNavigation.vue'
import { FlexRender } from '@tanstack/vue-table'
import { Calendar } from '@/components/ui/calendar'
import { Loader2 } from 'lucide-vue-next'
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
} from '@internationalized/date'

const { table, columns, form, grades, onSubmit, isLoading } = Student()
</script>

<template>
  <div class="flex items-center justify-between py-4">
    <Input
      class="w-1/4"
      placeholder="Find by name..."
      :model-value="table.getColumn('name')?.getFilterValue() as string"
      @update:model-value="table.getColumn('name')?.setFilterValue($event)"
    />
    <Dialog>
      <DialogTrigger>
        <Button><Plus />New Student</Button>
      </DialogTrigger>
      <DialogContent>
        <form @submit="onSubmit" class="flex flex-col gap-4">
          <DialogHeader><DialogTitle>New Student</DialogTitle></DialogHeader>
          <div class="flex flex-col gap-8">
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    type="name"
                    placeholder="Student Name"
                    v-bind="componentField"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="birthDate">
              <FormItem class="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger>
                    <FormControl>
                      <Input
                        id="birthDate"
                        type="text"
                        placeholder="Date of birth"
                        v-bind="componentField"
                        required
                      />
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <Calendar
                      calendar-label="Date of birth"
                      :default-value="today(getLocalTimeZone()).subtract({ years: 10 })"
                      @update:model-value="
                        (v) => {
                          if (v) {
                            form.setFieldValue('birthDate', v.toString())
                          } else {
                            form.setFieldValue('birthDate', undefined)
                          }
                        }
                      "
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="address">
              <FormItem>
                <FormLabel>Home address</FormLabel>
                <FormControl>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Home address"
                    v-bind="componentField"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Student Email"
                    v-bind="componentField"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="phoneNumber">
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input
                    id="phoneNumber"
                    type="phone"
                    placeholder="Phone number"
                    v-bind="componentField"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="gradeId">
              <FormItem>
                <FormLabel>Grade</FormLabel>
                <Select v-bind="componentField" required>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="grade in grades" :key="grade.id" :value="grade.id">{{
                        grade.name
                      }}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
            </FormField>
          </div>
          <DialogFooter>
            <Button type="submit" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
              Add Student
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
