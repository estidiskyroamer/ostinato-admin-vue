import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";
import { Paginated } from "@/interfaces/common";
import { User } from "@/interfaces/user";
import { valueUpdater } from "@/lib/utils";
import router from "@/router";
import { getGradeList } from "@/services/grade-service";
import { addStudent, getStudentList, getStudentListPaginated } from "@/services/user-service";
import type { ColumnDef } from '@tanstack/table-core';
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useVueTable } from "@tanstack/vue-table";
import { toTypedSchema } from "@vee-validate/zod";
import Cookies from 'js-cookie';
import { SquarePen, Trash2, UserCheck2, UserX2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { h, onMounted, ref } from "vue";
import * as z from "zod";
import StudentViewCard from "./StudentViewCard.vue";

export const formSchema = toTypedSchema(
  z.object({
    name: z.string(),
    email: z.string().email(),
    birthDate: z.string(),
    address: z.string(),
    phoneNumber: z.string().min(5).max(16),
    gradeId: z.string(),
  })
);

export function Student() {
  const isLoading = ref(false);
  const isFormLoading = ref(false);
  const studentList = ref<Paginated<User[]> | null>(null);
  const grades = ref<Grade[]>([]);
  const students = ref<User[]>([]);
  const companyId = ref<string | null>(null);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const columnFilters = ref<ColumnFiltersState>([]);

  const form = useForm({
    validationSchema: formSchema,
  });

  const getStudents = async () => {
    isLoading.value = true;
    const result = await getStudentList();
    if (result) {
      students.value = result;
    }
    isLoading.value = false;
  }

  const getGrades = async () => {
    const result = await getGradeList();
    if (result) {
      grades.value = result;
    }
  }

  const getCompany = () => {
    const companyCookie = Cookies.get('company');
    if (companyCookie) {
      const company = JSON.parse(companyCookie);
      companyId.value = company.id;
    }
  }

  const { toast } = useToast();

  onMounted(() => {
    getStudents();
    getGrades();
    getCompany();
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = { ...values, password: 'default', companyId: companyId.value ?? '' };

    isFormLoading.value = true;
    const result = await addStudent(payload)
    isLoading.value = false;
    console.log(result)
    if (result) {
      if (result.success) {
        toast({
          description: result.message
        });
      } else {
        toast({
          description: result.errors ? result.errors.join('\n') : "An error occured",
          variant: 'destructive'
        });
      }
    }
    else {
      toast({
        description: "An error occured",
        variant: 'destructive'
      });
    }
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) =>
        h(StudentViewCard, { user: row.original }),
    },
    {
      header: 'Grade',
      cell: ({ row }) => {
        const gradeName = row.original.student_grades && row.original.student_grades.length > 0 ? row.original.student_grades[0].grade.name : "-";
        return h('span', gradeName);
      },
      id: 'grade',
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

  return { table, columns, form, grades, onSubmit, isLoading };
}
