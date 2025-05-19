<script setup lang="ts">
import IconButton from '@/components/IconButton.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Schedule } from '@/interfaces/schedule'
import { User } from '@/interfaces/user'
import { parseStringToTime } from '@/utils/time-utils'
import { EllipsisVertical, Loader2 } from 'lucide-vue-next'
import { reactive, ref, watch } from 'vue'
import ScheduleDialog from '../dialogs/ScheduleDialog.vue'

const props = defineProps<{
  teacherData: User[]
  scheduleData: Schedule[]
  startTime: string
  endTime: string
  refresh: () => void
  isFormDataLoading: boolean
  isLoading: boolean
}>()

const teacherNames = ref<string[]>([])
const teacherMap = reactive<{ [key: string]: { [key: string]: Schedule } }>({})

watch(
  () => props.scheduleData,
  (newData) => {
    teacherNames.value = []
    Object.keys(teacherMap).forEach((key) => delete teacherMap[key])

    newData.forEach((entry) => {
      const teacherName = entry.teacher.name
      if (!teacherMap[teacherName]) {
        teacherMap[teacherName] = {}
        teacherNames.value.push(teacherName)
      }
      teacherMap[teacherName][entry.startTime] = entry
    })
  },
  { immediate: true },
)

const hours = ref(
  Array.from({ length: parseInt(props.endTime) - parseInt(props.startTime) + 1 }, (_, index) => {
    const hour = (parseInt(props.startTime) + index).toString().padStart(2, '0')
    return `${hour}:00`
  }),
)

const filteredSchedule = (teacherName: string) => {
  return props.scheduleData.filter((schedule) => schedule.teacher.name === teacherName)
}

const calculateScheduleStyle = (schedule: Schedule) => {
  const scheduleStartTime = parseStringToTime(props.startTime)
  const startTime = parseStringToTime(schedule.startTime)
  const endTime = parseStringToTime(schedule.endTime)
  const scheduleStartTotalMinutes = scheduleStartTime.hour * 60 + scheduleStartTime.minute
  const startTotalMinutes = startTime.hour * 60 + startTime.minute
  const endTotalMinutes = endTime.hour * 60 + endTime.minute
  const durationInMinutes = endTotalMinutes - startTotalMinutes
  const durationPercentage = durationInMinutes / 60
  const diffFromScheduleStart = (startTotalMinutes - scheduleStartTotalMinutes) / 60
  const height = 96 * durationPercentage
  const topOffset = 96 * diffFromScheduleStart

  return {
    height: `${height}px`,
    top: `${topOffset}px`,
  }
}

const statusColor = (status: string) => {
  switch (status) {
    case 'done':
      return 'bg-green-950'
    case 'canceled':
      return 'bg-red-950'
    default:
      return 'bg-neutral-900'
  }
}
</script>
<template>
  <div class="overflow-auto h-[800px]">
    <div v-if="isLoading" class="flex justify-center items-center h-full">
      <Loader2 class="w-4 h-4 mr-2 animate-spin" />
    </div>
    <div v-else>
      <div
        class="grid grid-cols-[150px_repeat(auto-fill,350px)] border-b pb-3 pt-6 mb-6 sticky top-0 bg-neutral-950 z-50"
      >
        <div class="text-center font-bold">Time</div>
        <div class="text-center font-bold" v-for="teacher in teacherNames" :key="teacher">
          {{ teacher }}
        </div>
      </div>
      <div class="grid grid-cols-[150px_repeat(auto-fill,350px)]">
        <div>
          <div v-for="hour in hours" :key="hour" class="border-b p-2 text-right h-24">
            {{ hour }}
          </div>
        </div>
        <div class="relative" v-for="teacher in teacherNames" :key="teacher">
          <div v-for="hour in hours" :key="hour" class="border-b border-l h-24"></div>
          <div
            v-for="schedule in filteredSchedule(teacher)"
            :key="`${schedule.id}`"
            :class="`absolute flex flex-row justify-between rounded-md w-full p-2 ${statusColor(schedule.status ?? '')}`"
            :style="calculateScheduleStyle(schedule)"
          >
            <div>
              {{ schedule.student.name }} ({{ schedule.instrument.name }})<br />{{
                schedule.startTime.slice(0, 5)
              }}
              - {{ schedule.endTime.slice(0, 5) }}
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  ><IconButton hintText="Menu"><EllipsisVertical /></IconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  ><ScheduleDialog
                    :isEdit="true"
                    :schedule="schedule"
                    :refresh="refresh"
                    :disabled="isFormDataLoading"
                    ><DropdownMenuItem @select="(e) => e.preventDefault()"
                      >Edit</DropdownMenuItem
                    ></ScheduleDialog
                  >
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
