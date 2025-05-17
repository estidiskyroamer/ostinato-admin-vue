import ConfirmDialog from '@/components/ConfirmDialog.vue';
import IconButton from '@/components/IconButton.vue';
import StatusIcon from '@/components/StatusIcon.vue';
import { Instrument } from '@/interfaces/instrument';
import { Schedule } from "@/interfaces/schedule";
import { User } from '@/interfaces/user';
import { getInstrumentList } from '@/services/instrument-service';
import { deleteSchedule, getDailySchedulePaginated } from "@/services/schedule-service";
import { getStudentList, getTeacherList } from '@/services/user-service';
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date';
import type { ColumnDef, ColumnFiltersState } from '@tanstack/table-core';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useVueTable } from "@tanstack/vue-table";
import { toTypedSchema } from "@vee-validate/zod";
import { useDebounceFn } from '@vueuse/core';
import { SquarePen, Trash2 } from "lucide-vue-next";
import { h, onMounted, Ref, ref, watch } from "vue";
import { z } from "zod";
import ScheduleDialog from './dialogs/ScheduleDialog.vue';
import { valueUpdater } from '@/lib/utils';

export const formSchema = toTypedSchema(
  z.object({
    teacherId: z.string(),
    studentId: z.string(),
    instrumentId: z.string(),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    status: z.string().optional().nullable(),
    repeat: z.number().optional().nullable(),
  })
);

export function Schedule() {
  const currentDate = today(getLocalTimeZone());
  const currentDateRef = ref(currentDate) as Ref<DateValue>;
  const isLoading = ref(false);
  const isFormDataLoading = ref(false);
  const scheduleList = ref<Schedule[]>([]);
  const totalPages = ref(1);
  const columnFilters = ref<ColumnFiltersState>([]);

  const teachers = ref<User[]>([])
  const students = ref<User[]>([])
  const instruments = ref<Instrument[]>([])

  const getCurrentSchedule = async () => {
    isLoading.value = true;
    const result = await getDailySchedulePaginated(new Date(currentDateRef.value.year, currentDateRef.value.month - 1, currentDateRef.value.day));
    if (result && result.data != null) {
      scheduleList.value = result.data.data;
      totalPages.value = result.data.last_page;
      isLoading.value = false;
    }
  }

  const getStudents = async () => {
    const result = await getStudentList()
    if (result) {
      students.value = result
    }
  }

  const getTeachers = async () => {
    const result = await getTeacherList()
    if (result) {
      teachers.value = result
    }
  }

  const getInstruments = async () => {
    const result = await getInstrumentList()
    if (result) {
      instruments.value = result
    }
  }

  const fetchFormData = async () => {
    isFormDataLoading.value = true;
    try {
      await Promise.all([
        getStudents(),
        getTeachers(),
        getInstruments(),])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      isFormDataLoading.value = false;
    }
  }

  onMounted(() => {
    getCurrentSchedule();
    fetchFormData();
  });

  const debouncedFetch = useDebounceFn(getCurrentSchedule, 300);
  watch(currentDateRef, debouncedFetch);

  const columns: ColumnDef<Schedule>[] = [
    { accessorFn: (row) => `${row.startTime.slice(0, 5)} - ${row.endTime.slice(0, 5)}`, header: 'Time' },
    { accessorFn: (row) => `${row.student.name} (${row.instrument.name})`, id: 'student', header: 'Student', },
    { accessorFn: (row) => row.teacher.name, id: 'teacher', header: 'Teacher' },
    {
      cell: ({ row }) => {
        return h('div', { class: 'flex items-center' }, [h(StatusIcon, { isRescheduled: row.original.isRescheduled, status: row.original.status })]);
      }, header: 'Status'
    },
    {
      cell: ({ row }) => {
        return h('div', { class: 'flex gap-2' }, [
          h(ScheduleDialog, { isEdit: true, schedule: row.original, refresh: () => getCurrentSchedule(), disabled: isFormDataLoading.value }, () => [
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

  return { teachers, students, instruments, table, currentDateRef, isLoading, isFormDataLoading, getCurrentSchedule };
}
