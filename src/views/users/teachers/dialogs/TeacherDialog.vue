<script setup lang="ts">
import { Button } from '@/components/ui/button'
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
import { toast } from '@/components/ui/toast/use-toast'
import { User } from '@/interfaces/user'
import { DEFAULT_PASSWORD } from '@/services/constants'
import { addTeacher, updateTeacher } from '@/services/user-service'
import Cookies from 'js-cookie'
import { Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { formSchema } from '../Teacher'

const props = withDefaults(
  defineProps<{
    isEdit?: boolean
    teacher?: User
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

const companyId = ref<string | null>(null)

const onSubmit = form.handleSubmit(async (values) => {
  let password = DEFAULT_PASSWORD
  let teacherId = ''

  if (props.isEdit) {
    password = props.teacher?.password ?? ''
    teacherId = props.teacher?.id ?? ''
  }
  const payload = {
    ...values,
    teacherId: teacherId,
    password: password,
    companyId: companyId.value ?? '',
  }

  console.log('payload:', payload)

  isLoading.value = true
  const result = props.isEdit ? await updateTeacher(payload) : await addTeacher(payload)
  isLoading.value = false

  if (result) {
    toast({
      description: props.isEdit ? 'Teacher updated successfully' : 'Teacher added successfully',
    })
    if (props.refresh) props.refresh()
    isDialogOpen.value = false // Close dialog on success
  } else {
    toast({
      description: 'An error occurred',
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

  if (props.teacher) {
    form.setValues({
      name: props.teacher.name,
      email: props.teacher.email ?? '',
      phoneNumber: props.teacher.phoneNumber ?? '',
      isActive: props.teacher.isActive === 1 ? true : false,
    })
  } else {
    form.setValues({
      name: '',
      email: '',
      phoneNumber: '',
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
        <DialogHeader
          ><DialogTitle>{{
            props.isEdit ? 'Update Teacher' : 'New Teacher'
          }}</DialogTitle></DialogHeader
        >
        <div class="flex flex-col gap-8">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  type="name"
                  placeholder="Teacher Name"
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
                  placeholder="Teacher Email"
                  v-bind="componentField"
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
          <FormField v-slot="{ componentField }" type="checkbox" name="isActive">
            <FormItem>
              <FormControl class="mr-4">
                <Checkbox v-bind="componentField" />
              </FormControl>
              <FormLabel>Active</FormLabel>
            </FormItem>
          </FormField>
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
            {{ props.isEdit ? 'Update Teacher' : 'Add Teacher' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
