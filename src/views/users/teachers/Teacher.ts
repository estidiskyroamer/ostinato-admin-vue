import { Paginated } from "@/interfaces/common";
import { User } from "@/interfaces/user";
import { getTeacherList, getTeacherListPaginated } from "@/services/user-service";
import type { ColumnDef } from '@tanstack/table-core';
import { getCoreRowModel, getPaginationRowModel, useVueTable } from "@tanstack/vue-table";
import { onMounted, ref } from "vue";

export function Teacher() {
    const isLoading = ref(false);
    const teacherList = ref<Paginated<User[]> | null>(null);
    const teachers = ref<User[]>([]);
    const currentPage = ref(1);
    const totalPages = ref(1);

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
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'E-mail' },
        { accessorKey: 'phoneNumber', header: 'Phone Number' },
        { accessorFn: (row) => row.isActive == 1 ? 'Active' : 'Inactive', header: 'Status' },
        { accessorKey: 'action', header: '' }
    ];

    const table = useVueTable({
        columns,
        data: teachers,
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