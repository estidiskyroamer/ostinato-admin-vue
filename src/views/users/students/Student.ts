import IconButton from '@/components/IconButton.vue';
import { User } from "@/interfaces/user";
import { valueUpdater } from "@/lib/utils";
import { deleteStudent, getStudentList } from "@/services/user-service";
import type { ColumnDef } from '@tanstack/table-core';
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useVueTable } from "@tanstack/vue-table";
import { toTypedSchema } from "@vee-validate/zod";
import { CalendarDays, SquarePen, Trash2, UserCheck2, UserX2 } from "lucide-vue-next";
import { h, onMounted, ref } from "vue";
import * as z from "zod";
import StudentViewCard from "./StudentViewCard.vue";
import StudentDialog from "./dialogs/StudentDialog.vue";
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import ScheduleDrawer from './dialogs/ScheduleDrawer.vue';

export const formSchema = toTypedSchema(
  z.object({
    name: z.string(),
    email: z.string().email(),
    birthDate: z.string(),
    address: z.string(),
    phoneNumber: z.string().min(5).max(16),
    isActive: z.boolean().default(false),
  })
);

export function Student() {
  const isLoading = ref(false);
  const students = ref<User[]>([]);
  const columnFilters = ref<ColumnFiltersState>([]);

  const getStudents = async () => {
    isLoading.value = true;
    const result = await getStudentList();
    if (result) {
      students.value = result;
    }
    isLoading.value = false;
  }

  onMounted(() => {
    getStudents();
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) =>
        h(StudentViewCard, { user: row.original }),
    },
    {
      cell: ({ row }) => {
        const icons = [];
        if (row.original.isActive) {
          icons.push(h(UserCheck2, { class: 'text-green-700' }));
        }
        else icons.push(h(UserX2, { class: 'text-red-700' }));
        return h('div', { class: 'flex items-center' }, icons);
      }, header: 'Status'
    },
    {
      cell: ({ row }) => {
        return h('div', { class: 'flex gap-2' }, [
          h(ScheduleDrawer, { student: row.original }, () => [
            h(IconButton, { hintText: `View schedule` }, () => [
              h(CalendarDays)
            ]),
          ]),
          h(StudentDialog, { isEdit: true, student: row.original, refresh: () => getStudents() }, () => [
            h(IconButton, { hintText: `Edit ${row.original.name}` }, () => [
              h(SquarePen, { class: 'text-yellow-500' })
            ]),
          ]),
          h(ConfirmDialog, { title: `Are you sure you want to remove ${row.original.name} data?`, actionText: 'Remove', action: () => deleteStudent(row.original), refresh: () => getStudents() }, () => [
            h(IconButton, { hintText: `Remove ${row.original.name}` }, () => [
              h(Trash2, { class: 'text-red-500' })
            ]),
          ]),

        ])
      }, header: '', id: 'action'
    }
  ];

  const table = useVueTable({
    columns,
    data: students,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
    state: {
      get columnFilters() { return columnFilters.value },
    },
    initialState: {
      pagination: {
        pageSize: 15
      }
    }
  });

  return { table, isLoading, getStudents };
}
