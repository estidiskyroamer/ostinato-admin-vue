import { Schedule } from "@/interfaces/schedule";
import { Paginated } from "@/interfaces/common";
import { getDailySchedulePaginated } from "@/services/schedule-service";
import { computed, onMounted, ref } from "vue";
import { getCoreRowModel, getPaginationRowModel, useVueTable } from "@tanstack/vue-table";
import type { ColumnDef } from '@tanstack/table-core';

export function Dashboard() {
    const currentDate = new Date();
    const isLoading = ref(false);
    const scheduleList = ref<Schedule[]>([]);
    const currentPage = ref(1);
    const totalPages = ref(1);

    const getCurrentSchedule = async () => {
        isLoading.value = true;
        const result = await getDailySchedulePaginated(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
        if (result && result.data != null) {
            scheduleList.value = result.data;
            totalPages.value = result.last_page;
        }
        isLoading.value = false;
    }

    onMounted(() => {
        getCurrentSchedule();
    });


    const columns: ColumnDef<Schedule>[] = [
        { accessorFn: (row) => `${row.startTime.slice(0, 5)} - ${row.endTime.slice(0, 5)}`, header: 'Time' },
        { accessorFn: (row) => row.student.name, header: 'Student', },
        { accessorFn: (row) => row.teacher.name, header: 'Teacher' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'action', header: '' }
    ];

    const table = useVueTable({
        columns,
        data: scheduleList,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 15
            }
        }
    });

    return { table, columns, currentDate, isLoading };
}