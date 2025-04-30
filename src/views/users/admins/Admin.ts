import { Paginated } from "@/interfaces/common";
import { User } from "@/interfaces/user";
import { getAdminList, getAdminListPaginated } from "@/services/user-service";
import type { ColumnDef } from '@tanstack/table-core';
import { getCoreRowModel, getPaginationRowModel, useVueTable } from "@tanstack/vue-table";
import { h, onMounted, ref } from "vue";
import AdminViewCard from "./AdminViewCard.vue";
import { UserCheck2, UserX2, SquarePen, Trash2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

export function Admin() {
  const isLoading = ref(false);
  const adminList = ref<Paginated<User[]> | null>(null);
  const admins = ref<User[]>([]);
  const currentPage = ref(1);
  const totalPages = ref(1);

  const getAdmins = async () => {
    isLoading.value = true;
    const result = await getAdminList();
    if (result) {
      admins.value = result;
    }
    isLoading.value = false;
  }

  onMounted(() => {
    getAdmins();
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) =>
        h(AdminViewCard, { user: row.original }),
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
    data: admins,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 15
      }
    }
  });

  return { table, columns, isLoading };
}
