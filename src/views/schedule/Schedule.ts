import ConfirmDialog from '@/components/ConfirmDialog.vue';
import IconButton from '@/components/IconButton.vue';
import { Schedule } from "@/interfaces/schedule";
import { deleteSchedule, getDailySchedulePaginated } from "@/services/schedule-service";
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date';
import type { ColumnDef } from '@tanstack/table-core';
import { getCoreRowModel, getPaginationRowModel, useVueTable } from "@tanstack/vue-table";
import { toTypedSchema } from "@vee-validate/zod";
import { Check, RefreshCw, SquarePen, Trash2, X } from "lucide-vue-next";
import { h, onMounted, Ref, ref, watch } from "vue";
import { z } from "zod";
import ScheduleDialog from './dialogs/ScheduleDialog.vue';

export const formSchema = toTypedSchema(
  z.object({
    teacherId: z.string(),
    studentId: z.string(),
    instrumentId: z.string(),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    status: z.string().nullable(),
    repeat: z.number(),
  })
);

export function Schedule() {
  const currentDate = today(getLocalTimeZone());
  const currentDateRef = ref(currentDate) as Ref<DateValue>;
  const isLoading = ref(false);
  const scheduleList = ref<Schedule[]>([]);
  const currentPage = ref(1);
  const totalPages = ref(1);

  const getCurrentSchedule = async () => {
    isLoading.value = true;
    const result = await getDailySchedulePaginated(new Date(currentDateRef.value.year, currentDateRef.value.month - 1, currentDateRef.value.day));
    if (result && result.data != null) {
      scheduleList.value = result.data.data;
      totalPages.value = result.data.last_page;
    }
    isLoading.value = false;
  }

  onMounted(() => {
    getCurrentSchedule();
  });

  watch(currentDateRef, () => {
    getCurrentSchedule();
  });

  const columns: ColumnDef<Schedule>[] = [
    { accessorFn: (row) => `${row.startTime.slice(0, 5)} - ${row.endTime.slice(0, 5)}`, header: 'Time' },
    { accessorFn: (row) => `${row.student.name} (${row.instrument.name})`, header: 'Student', },
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
          h(ScheduleDialog, { isEdit: true, schedule: row.original, refresh: () => getCurrentSchedule() }, () => [
            h(IconButton, { hintText: `Edit schedule` }, () => [
              h(SquarePen, { class: 'text-yellow-500' })
            ]),
          ]),
          h(ConfirmDialog, {
            title: `Are you sure you want to delete this schedule?`,
            content: `${row.original.student.name} (${row.original.instrument.name}) ${row.original.date} ${row.original.startTime.slice(0, 5)} - ${row.original.endTime.slice(0, 5)}`,
            actionText: 'Remove', action: () => deleteSchedule(row.original), refresh: () => getCurrentSchedule(),
          }, () => [
            h(IconButton, { hintText: `${row.original.date} ${row.original.startTime.slice(0, 5)} - ${row.original.endTime.slice(0, 5)}` }, () => [
              h(Trash2, { class: 'text-red-500' })
            ]),
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

  return { table, currentDateRef, isLoading, getCurrentSchedule };
}
