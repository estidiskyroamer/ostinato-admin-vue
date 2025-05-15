<script setup lang="ts">
import IconButton from '@/components/IconButton.vue'
import PageNavigation from '@/components/PageNavigation.vue'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Schedule } from '@/interfaces/schedule'
import { User } from '@/interfaces/user'
import { deleteSchedule, getStudentSchedulePaginated } from '@/services/schedule-service'
import {
  ColumnDef,
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { Check, Loader2, RefreshCw, SquarePen, Trash2, X } from 'lucide-vue-next'
import { h, ref, watch } from 'vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const props = defineProps<{
  student: User
}>()

const isLoading = ref(false)
const schedules = ref<Schedule[]>([])

const getSchedule = async () => {
  isLoading.value = true
  if (props.student && props.student.id) {
    const result = await getStudentSchedulePaginated(props.student.id)
    if (result && result.data != null) {
      schedules.value = result.data
    }
    isLoading.value = false
  }
}
const isDialogOpen = ref(false)
watch(isDialogOpen, (newValue) => {
  if (newValue) {
    onDialogOpen()
  }
})
const onDialogOpen = () => {
  getSchedule()
}

const columns: ColumnDef<Schedule>[] = [
  { accessorFn: (row) => row.date, header: 'Date' },
  {
    accessorFn: (row) => `${row.startTime.slice(0, 5)} - ${row.endTime.slice(0, 5)}`,
    header: 'Time',
  },
  { accessorFn: (row) => row.instrument.name, header: 'Instrument' },
  { accessorFn: (row) => row.teacher.name, header: 'Teacher' },
  {
    cell: ({ row }) => {
      const icons = []
      if (row.original.isRescheduled === 1) {
        icons.push(h(RefreshCw, { class: 'text-yellow-700' }))
      }

      switch (row.original.status) {
        case 'done':
          icons.push(h(Check, { class: 'text-green-700' }))
          break
        case 'canceled':
          icons.push(h(X, { class: 'text-red-700' }))
          break
        default:
          icons.push('')
          break
      }
      return h('div', { class: 'flex items-center' }, icons)
    },
    header: 'Status',
  },
  {
    cell: ({ row }) => {
      return h('div', { class: 'flex gap-2' }, [
        h(IconButton, { hintText: 'Edit schedule' }, () => [
          h(SquarePen, { class: 'text-yellow-500' }),
        ]),
        h(
          ConfirmDialog,
          {
            title: `Are you sure you want to delete this schedule?`,
            content: `${row.original.date} ${row.original.startTime.slice(0, 5)} - ${row.original.endTime.slice(0, 5)}`,
            actionText: 'Remove',
            action: () => deleteSchedule(row.original),
            refresh: () => getSchedule(),
          },
          () => [
            h(IconButton, { hintText: `Delete schedule` }, () => [
              h(Trash2, { class: 'text-red-500' }),
            ]),
          ],
        ),
      ])
    },
    header: '',
    id: 'action',
  },
]

const table = useVueTable({
  columns,
  data: schedules,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: {
    pagination: {
      pageSize: 8,
    },
  },
})
</script>

<template>
  <Drawer v-model:open="isDialogOpen">
    <DrawerTrigger><slot /></DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Schedule</DrawerTitle>
        <DrawerDescription>{{ props.student.name }}</DrawerDescription>
      </DrawerHeader>
      <div class="flex flex-col px-6">
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
      </div>
      <DrawerFooter>
        <DrawerClose>
          <Button variant="outline"> Close </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>
