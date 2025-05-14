<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from '@/components/ui/toast/use-toast'
import { User } from '@/interfaces/user'
import { DEFAULT_PASSWORD } from '@/services/constants'
import { addStudent, updateStudent } from '@/services/user-service'
import { getLocalTimeZone, today } from '@internationalized/date'
import Cookies from 'js-cookie'
import { Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { formSchema } from '../Student'

const props = withDefaults(
  defineProps<{
    isEdit?: boolean
    student?: User
    refresh?: () => void
  }>(),
  {
    isEdit: false,
  },
)

const form = useForm({
  validationSchema: formSchema,
})
const isLoading = ref(false)
const isFormLoading = ref(false)

const companyId = ref<string | null>(null)

const onSubmit = form.handleSubmit(async (values) => {
  let password = DEFAULT_PASSWORD
  let studentId = ''

  if (props.isEdit) {
    password = props.student?.password ?? ''
    studentId = props.student?.id ?? ''
  }
  const payload = {
    ...values,
    studentId: studentId,
    password: password,
    companyId: companyId.value ?? '',
  }

  isFormLoading.value = true
  const result = props.isEdit ? await updateStudent(payload) : await addStudent(payload)
  isLoading.value = false
  if (result) {
    if (result.success) {
      toast({
        description: result.message,
      })
      if (props.refresh) props.refresh()
    } else {
      toast({
        description: result.errors ? result.errors.join('\n') : 'An error occured',
        variant: 'destructive',
      })
    }
  } else {
    toast({
      description: 'An error occured',
      variant: 'destructive',
    })
  }
})

const getCompany = () => {
  const companyCookie = Cookies.get('company')
  if (companyCookie) {
    const company = JSON.parse(companyCookie)
    companyId.value = company.id
  }
}
const isDialogOpen = ref(false)
watch(isDialogOpen, (newValue) => {
  if (newValue) {
    onDialogOpen()
  }
})
const onDialogOpen = () => {
  getCompany()

  if (props.student) {
    form.setValues({
      name: props.student.name,
      email: props.student.email,
      birthDate: props.student.birthDate ?? '',
      address: props.student.address ?? '',
      phoneNumber: props.student.phoneNumber ?? '',
      gradeId: props.student.student_grades?.[0]?.grade.id ?? '',
      isActive: props.student.isActive === 1 ? true : false,
    })
  } else {
    form.setValues({
      isActive: props.isEdit ? false : true,
    })
  }
}
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <form @submit="onSubmit" class="flex flex-col gap-4">
        <DialogHeader><DialogTitle>New Student</DialogTitle></DialogHeader>
        <div class="flex flex-col gap-8">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  type="name"
                  placeholder="Student Name"
                  v-bind="componentField"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="birthDate">
            <FormItem class="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger>
                  <FormControl>
                    <Input
                      id="birthDate"
                      type="text"
                      placeholder="Date of birth"
                      v-bind="componentField"
                      required
                    />
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar
                    calendar-label="Date of birth"
                    :default-value="today(getLocalTimeZone()).subtract({ years: 10 })"
                    @update:model-value="
                      (v) => {
                        if (v) {
                          form.setFieldValue('birthDate', v.toString())
                        } else {
                          form.setFieldValue('birthDate', undefined)
                        }
                      }
                    "
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="address">
            <FormItem>
              <FormLabel>Home address</FormLabel>
              <FormControl>
                <Input
                  id="address"
                  type="text"
                  placeholder="Home address"
                  v-bind="componentField"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="Student Email"
                  v-bind="componentField"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="phoneNumber">
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input
                  id="phoneNumber"
                  type="phone"
                  placeholder="Phone number"
                  v-bind="componentField"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ value, handleChange }" type="checkbox" name="isActive">
            <FormItem>
              <FormControl class="mr-4">
                <Checkbox :model-value="value" @update:model-value="handleChange" />
              </FormControl>
              <FormLabel>Active</FormLabel>
            </FormItem>
          </FormField>
        </div>
        <DialogFooter>
          <DialogClose as-child
            ><Button type="submit" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
              {{ props.isEdit ? 'Update Student' : 'Add Student' }}
            </Button></DialogClose
          >
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
