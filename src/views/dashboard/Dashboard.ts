import { Schedule } from "@/interfaces/schedule";
import { Paginated } from "@/interfaces/common";
import { getDailySchedulePaginated } from "@/services/schedule-service";
import { computed, h, onMounted, Ref, ref } from "vue";
import { getCoreRowModel, getPaginationRowModel, useVueTable } from "@tanstack/vue-table";
import type { ColumnDef } from '@tanstack/table-core';
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date';
import { toDate } from "reka-ui/date";
import { Check, RefreshCw, SquarePen, Trash2, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  const currentDate = today(getLocalTimeZone());
  const isLoading = ref(false);
  const scheduleList = ref<Schedule[]>([]);
  const currentPage = ref(1);
  const totalPages = ref(1);

  const getCurrentSchedule = async () => {
    isLoading.value = true;
    const result = await getDailySchedulePaginated(toDate(currentDate));
    if (result && result.data != null) {
      scheduleList.value = result.data.data;
      totalPages.value = result.data.last_page;
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
    {
      cell: ({ row }) => {
        const icons = [];
        if (row.original.isRescheduled === 1) {
          icons.push(h(RefreshCw, { class: 'text-yellow-700' }));
        }

        switch (row.original.status) {
          case 'done':
            icons.push(h(Check, { class: 'text-green-700' })); break;
          case 'canceled':
            icons.push(h(X, { class: 'text-red-700' })); break;
          default:
            icons.push(''); break;
        }
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
