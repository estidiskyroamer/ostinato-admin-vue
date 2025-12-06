import IconButton from '@/components/IconButton.vue'
import { User } from '@/interfaces/user'
import { valueUpdater } from '@/lib/utils'
import { deleteTeacher, getTeacherList } from '@/services/user-service'
import type { ColumnDef } from '@tanstack/table-core'
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { toTypedSchema } from '@vee-validate/zod'
import { SquarePen, Trash2, UserCheck2, UserX2 } from 'lucide-vue-next'
import { h, onMounted, ref } from 'vue'
import * as z from 'zod'
import TeacherViewCard from './TeacherViewCard.vue'
import TeacherDialog from './dialogs/TeacherDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

export const formSchema = toTypedSchema(
  z.object({
    name: z.string(),
    email: z.string().email().or(z.literal('')),
    phoneNumber: z.string().min(5).max(16),
    isActive: z.boolean().default(true),
  }),
)

export function Teacher() {
  const isLoading = ref(false)
  const teachers = ref<User[]>([])
  const columnFilters = ref<ColumnFiltersState>([])

  const getTeachers = async () => {
    isLoading.value = true
    const result = await getTeacherList()
    if (result) {
      teachers.value = result
    }
    isLoading.value = false
  }

  onMounted(() => {
    getTeachers()
  })

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => h(TeacherViewCard, { user: row.original }),
    },
    {
      cell: ({ row }) => {
        const icons = []
        if (row.original.isActive) {
          icons.push(h(UserCheck2, { class: 'text-green-700' }))
        } else icons.push(h(UserX2, { class: 'text-red-700' }))
        return h('div', { class: 'flex items-center' }, icons)
      },
      header: 'Status',
    },
    {
      cell: ({ row }) => {
        return h('div', { class: 'flex gap-2' }, [
          h(
            TeacherDialog,
            { isEdit: true, teacher: row.original, refresh: () => getTeachers() },
            () => [
              h(IconButton, { hintText: `Edit ${row.original.name}` }, () => [
                h(SquarePen, { class: 'text-yellow-500' }),
              ]),
            ],
          ),
          h(
            ConfirmDialog,
            {
              title: `Are you sure you want to remove ${row.original.name} data?`,
              actionText: 'Remove',
              action: () => deleteTeacher(row.original),
              refresh: () => getTeachers(),
            },
            () => [
              h(IconButton, { hintText: `Remove ${row.original.name}` }, () => [
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
    data: teachers,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
    state: {
      get columnFilters() {
        return columnFilters.value
      },
    },
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  })

  return { table, isLoading, getTeachers }
}
