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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Student } from './Student'
import { Plus } from 'lucide-vue-next'
import PageNavigation from '@/components/PageNavigation.vue'
import { FlexRender } from '@tanstack/vue-table'
import { Loader2 } from 'lucide-vue-next'

const { table, columns, onSubmit, isLoading } = Student()
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
        <DialogHeader><DialogTitle>New Student</DialogTitle></DialogHeader>
        <div class="flex flex-col gap-8">
          <form @submit="onSubmit" class="flex flex-col gap-4">
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
            <FormField v-slot="{ componentField }" name="birth_date">
              <FormItem class="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger>
                    <FormControl>
                      <Input
                        id="birth_date"
                        type="email"
                        placeholder="Date of birth"
                        v-bind="componentField"
                        required
                      />
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <Calendar
                      v-model:placeholder="placeholder"
                      v-model="value"
                      calendar-label="Date of birth"
                      initial-focus
                      :min-value="new CalendarDate(1900, 1, 1)"
                      :max-value="today(getLocalTimeZone())"
                      @update:model-value="
                        (v) => {
                          if (v) {
                            setFieldValue('dob', v.toString())
                          } else {
                            setFieldValue('dob', undefined)
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
            <FormField v-slot="{ componentField }" name="phone_number">
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input
                    id="phone_number"
                    type="phone"
                    placeholder="Phone number"
                    v-bind="componentField"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </form>
        </div>
        <DialogFooter>
          <Button type="submit" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
            Add Student
          </Button>
        </DialogFooter>
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
