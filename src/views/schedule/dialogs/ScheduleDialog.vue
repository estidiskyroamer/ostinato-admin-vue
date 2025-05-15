<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/combobox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from '@/components/ui/toast/use-toast'
import { Schedule } from '@/interfaces/schedule'
import { User } from '@/interfaces/user'
import { DEFAULT_PASSWORD, scheduleStatuses } from '@/services/constants'
import { addStudent, getStudentList, getTeacherList, updateStudent } from '@/services/user-service'
import { getLocalTimeZone, today } from '@internationalized/date'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { formSchema } from '../Schedule'
import { addSchedule, updateSchedule } from '@/services/schedule-service'
import { getInstrumentList } from '@/services/instrument-service'
import { Instrument } from '@/interfaces/instrument'

const props = withDefaults(
  defineProps<{
    isEdit?: boolean
    schedule?: Schedule
    refresh?: () => void
  }>(),
  {
    isEdit: false,
  },
)

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    repeat: 1,
  },
})
const isLoading = ref(false)
const isFormLoading = ref(false)
const repeatChecked = ref(false)

const teachers = ref<User[]>([])
const students = ref<User[]>([])
const instruments = ref<Instrument[]>([])

const onSubmit = form.handleSubmit(async (values) => {
  console.log(values)
  let scheduleId = ''

  if (props.isEdit) {
    scheduleId = props.schedule?.id ?? ''
  }
  const payload = {
    ...values,
    scheduleId: scheduleId,
    status: form.values.status,
    repeat: values.repeat.toString(),
  }

  isFormLoading.value = true
  isLoading.value = true
  const result = await addSchedule(payload)
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

const getStudents = async () => {
  isLoading.value = true
  const result = await getStudentList()
  if (result) {
    students.value = result
  }
  isLoading.value = false
}

const getTeachers = async () => {
  isLoading.value = true
  const result = await getTeacherList()
  if (result) {
    teachers.value = result
  }
  isLoading.value = false
}

const getInstruments = async () => {
  isLoading.value = true
  const result = await getInstrumentList()
  if (result) {
    instruments.value = result
  }
  isLoading.value = false
}

const isDialogOpen = ref(false)
watch(isDialogOpen, (newValue) => {
  if (newValue) {
    onDialogOpen()
  }
})
const onDialogOpen = () => {
  getStudents()
  getTeachers()
  getInstruments()

  if (props.schedule) {
    form.setValues({
      teacherId: props.schedule.teacherId,
      studentId: props.schedule.studentId,
      instrumentId: props.schedule.instrumentId,
      date: props.schedule.date,
      startTime: props.schedule.startTime,
      endTime: props.schedule.endTime,
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
            props.isEdit ? 'Update Schedule' : 'New Schedule'
          }}</DialogTitle></DialogHeader
        >
        <div class="flex flex-col gap-8">
          <FormField name="studentId">
            <FormItem>
              <FormLabel>Student</FormLabel>
              <Combobox by="name">
                <FormControl>
                  <ComboboxAnchor>
                    <div class="relative w-full items-center">
                      <ComboboxInput
                        :display-value="(val) => val?.name ?? ''"
                        placeholder="Select student..."
                        required
                      />
                      <ComboboxTrigger
                        class="absolute end-0 inset-y-0 flex items-center justify-center px-3"
                      >
                        <ChevronsUpDown class="size-4 text-muted-foreground" />
                      </ComboboxTrigger>
                    </div>
                  </ComboboxAnchor>
                </FormControl>

                <ComboboxList>
                  <ComboboxEmpty> Nothing found. </ComboboxEmpty>
                  <ComboboxGroup>
                    <ComboboxItem
                      v-for="student in students"
                      :key="student.id"
                      :value="student"
                      @select="
                        () => {
                          form.setFieldValue('studentId', student.id)
                        }
                      "
                    >
                      {{ student.name }}

                      <ComboboxItemIndicator> </ComboboxItemIndicator>
                    </ComboboxItem>
                  </ComboboxGroup>
                </ComboboxList>
              </Combobox>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="teacherId">
            <FormItem>
              <FormLabel>Teacher</FormLabel>
              <Combobox by="label">
                <FormControl>
                  <ComboboxAnchor>
                    <div class="relative w-full items-center">
                      <ComboboxInput
                        :display-value="(val) => val?.name ?? ''"
                        placeholder="Select teacher..."
                        required
                      />
                      <ComboboxTrigger
                        class="absolute end-0 inset-y-0 flex items-center justify-center px-3"
                      >
                        <ChevronsUpDown class="size-4 text-muted-foreground" />
                      </ComboboxTrigger>
                    </div>
                  </ComboboxAnchor>
                </FormControl>

                <ComboboxList>
                  <ComboboxEmpty> Nothing found. </ComboboxEmpty>
                  <ComboboxGroup>
                    <ComboboxItem
                      v-for="teacher in teachers"
                      :key="teacher.id"
                      :value="teacher"
                      @select="
                        () => {
                          form.setFieldValue('teacherId', teacher.id)
                        }
                      "
                    >
                      {{ teacher.name }}

                      <ComboboxItemIndicator> </ComboboxItemIndicator>
                    </ComboboxItem>
                  </ComboboxGroup>
                </ComboboxList>
              </Combobox>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="instrumentId">
            <FormItem>
              <FormLabel>Instrument</FormLabel>
              <Combobox by="label">
                <FormControl>
                  <ComboboxAnchor>
                    <div class="relative w-full items-center">
                      <ComboboxInput
                        :display-value="(val) => val?.name ?? ''"
                        placeholder="Select instrument..."
                        required
                      />
                      <ComboboxTrigger
                        class="absolute end-0 inset-y-0 flex items-center justify-center px-3"
                      >
                        <ChevronsUpDown class="size-4 text-muted-foreground" />
                      </ComboboxTrigger>
                    </div>
                  </ComboboxAnchor>
                </FormControl>

                <ComboboxList>
                  <ComboboxEmpty> Nothing found. </ComboboxEmpty>
                  <ComboboxGroup>
                    <ComboboxItem
                      v-for="instrument in instruments"
                      :key="instrument.id"
                      :value="instrument"
                      @select="
                        () => {
                          form.setFieldValue('instrumentId', instrument.id)
                        }
                      "
                    >
                      {{ instrument.name }}

                      <ComboboxItemIndicator> </ComboboxItemIndicator>
                    </ComboboxItem>
                  </ComboboxGroup>
                </ComboboxList>
              </Combobox>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="date">
            <FormItem class="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger>
                  <FormControl>
                    <Input
                      id="date"
                      type="text"
                      placeholder="Start date"
                      v-bind="componentField"
                      required
                    />
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar
                    calendar-label="Date"
                    :default-value="today(getLocalTimeZone())"
                    @update:model-value="
                      (v) => {
                        if (v) {
                          form.setFieldValue('date', v.toString())
                        } else {
                          form.setFieldValue('date', undefined)
                        }
                      }
                    "
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="flex flex-row gap-4">
            <FormField v-slot="{ componentField }" name="startTime">
              <FormItem class="flex-1">
                <FormLabel>Start time</FormLabel>
                <FormControl>
                  <Input id="address" type="time" v-bind="componentField" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="endTime">
              <FormItem class="flex-1">
                <FormLabel>End time</FormLabel>
                <FormControl>
                  <Input id="address" type="time" v-bind="componentField" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="flex flex-row gap-2">
            <FormField type="checkbox" name="repeatCheck">
              <FormItem>
                <FormControl class="mr-4">
                  <Checkbox v-model="repeatChecked" />
                </FormControl>
                <FormLabel>Repeat for</FormLabel>
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="repeat">
              <FormItem>
                <FormControl>
                  <div class="flex flex-row gap-2">
                    <Input
                      id="repeat"
                      type="number"
                      v-bind="componentField"
                      :disabled="!repeatChecked"
                    />
                    <span>weeks</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <FormField v-slot="{ componentField }" name="status">
            <FormItem class="flex flex-col">
              <FormLabel>Status</FormLabel>
              <Select v-bind="componentField">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="status in scheduleStatuses"
                    :key="status ?? 'none'"
                    :value="status"
                    >{{ status ?? 'None' }}</SelectItem
                  >
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <DialogFooter
          ><DialogClose as-child>
            <Button type="submit" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
              {{ props.isEdit ? 'Update Schedule' : 'Add Schedule' }}
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
