import { Paginated } from "@/interfaces/common";
import { User } from "@/interfaces/user";
import { getAdminList, getAdminListPaginated } from "@/services/user-service";
import type { ColumnDef } from '@tanstack/table-core';
import { getCoreRowModel, getPaginationRowModel, useVueTable } from "@tanstack/vue-table";
import { onMounted, ref } from "vue";

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
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'E-mail' },
        { accessorKey: 'phoneNumber', header: 'Phone Number' },
        { accessorFn: (row) => row.isActive == 1 ? 'Active' : 'Inactive', header: 'Status' },
        { accessorKey: 'action', header: '' }
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