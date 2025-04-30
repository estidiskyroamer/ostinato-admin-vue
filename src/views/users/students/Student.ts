import { Paginated } from "@/interfaces/common";
import { User } from "@/interfaces/user";
import { valueUpdater } from "@/lib/utils";
import { getStudentList, getStudentListPaginated } from "@/services/user-service";
import type { ColumnDef } from '@tanstack/table-core';
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useVueTable } from "@tanstack/vue-table";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { onMounted, ref } from "vue";
import * as z from "zod";

export const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
  })
);

export function Student() {
  const isLoading = ref(false);
  const studentList = ref<Paginated<User[]> | null>(null);
  const students = ref<User[]>([]);
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

  onMounted(() => {
    getStudents();
  });

  const onSubmit = form.handleSubmit(async (values) => {
    console.log(values);
    /* isLoading.value = true;
    const loginSuccess = await login(values.email, values.password);
    isLoading.value = false;

    if (loginSuccess) {
      toast({
        description: 'Login success'
      });
      router.push("/dashboard");
    } else {
      toast({
        description: 'Login failed',
        variant: 'destructive'
      });
    } */
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

  return { table, columns, onSubmit, isLoading };
}
