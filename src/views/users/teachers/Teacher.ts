import { Paginated } from "@/interfaces/common";
import { User } from "@/interfaces/user";
import { valueUpdater } from "@/lib/utils";
import { getTeacherList, getTeacherListPaginated } from "@/services/user-service";
import type { ColumnDef } from '@tanstack/table-core';
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useVueTable } from "@tanstack/vue-table";
import { h, onMounted, ref } from "vue";
import TeacherViewCard from "./TeacherViewCard.vue";
import { SquarePen, Trash2, UserCheck2, UserX2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

export function Teacher() {
  const isLoading = ref(false);
  const teacherList = ref<Paginated<User[]> | null>(null);
  const teachers = ref<User[]>([]);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const columnFilters = ref<ColumnFiltersState>([]);

  const getTeachers = async () => {
    isLoading.value = true;
    const result = await getTeacherList();
    if (result) {
      teachers.value = result;
    }
    isLoading.value = false;
  }

  onMounted(() => {
    getTeachers();
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) =>
        h(TeacherViewCard, { user: row.original }),
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
          h(Button, { variant: "ghost", size: "icon" }, () => [
            h(SquarePen)
          ]),
          h(Button, { variant: "ghost", size: "icon" }, () => [
            h(Trash2, { class: 'text-red-500' })
          ]),
        ])
      }, header: '', id: 'action'
    }
  ];

  const table = useVueTable({
    columns,
    data: teachers,
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

  return { table, columns, isLoading };
}
