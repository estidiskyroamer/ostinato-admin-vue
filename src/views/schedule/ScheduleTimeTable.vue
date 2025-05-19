<template>
  <div class="w-full overflow-x-auto shadow-lg rounded-lg">
    <div class="min-w-full bg-white">
      <!-- Header with teacher names -->
      <div class="grid" :style="gridTemplateStyle">
        <div class="p-3 font-semibold text-center border-b bg-gray-50">Hours</div>
        <div
          v-for="teacher in teachers"
          :key="teacher.id"
          class="p-3 font-semibold text-center border-b border-l bg-gray-50"
        >
          {{ teacher.name }}
        </div>
      </div>

      <!-- Timetable grid -->
      <div class="relative">
        <!-- Hours column -->
        <div class="grid" :style="`grid-template-rows: repeat(${hoursCount}, 6rem)`">
          <div
            v-for="hour in hours"
            :key="hour"
            class="relative border-b h-24 flex items-start justify-center"
          >
            <span class="absolute -top-3 px-2 bg-white text-sm text-gray-600">{{
              formatHour(hour)
            }}</span>
          </div>
        </div>

        <!-- Schedule items -->
        <div
          v-for="(schedule, index) in schedules"
          :key="index"
          class="absolute rounded-md p-2 shadow-sm border border-gray-200 overflow-hidden"
          :style="getScheduleStyle(schedule)"
          :class="getScheduleClass(index)"
        >
          <div class="text-xs font-semibold mb-1">{{ schedule.title }}</div>
          <div class="text-xs">{{ formatTimeRange(schedule.startTime, schedule.endTime) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Interfaces for type definitions
interface Teacher {
  id: string | number
  name: string
}

interface Schedule {
  teacherId: string | number
  title: string
  startTime: string // Format: "HH:MM"
  endTime: string // Format: "HH:MM"
  type?: string // Optional, for color coding
}

// Props with TypeScript type annotations
interface Props {
  teachers: Teacher[]
  schedules: Schedule[]
  startHour: number
  endHour: number
}

const props = withDefaults(defineProps<Props>(), {
  startHour: 8, // 8 AM default
  endHour: 17, // 5 PM default
})

// Generate hours array
const hoursCount = computed((): number => props.endHour - props.startHour + 1)

const hours = computed((): number[] => {
  return Array.from({ length: hoursCount.value }, (_, i) => props.startHour + i)
})

// Generate grid template for columns (teachers)
const gridTemplateStyle = computed((): string => {
  return `grid-template-columns: 6rem repeat(${props.teachers.length}, minmax(180px, 1fr))`
})

// Format hour for display (24-hour format to 12-hour format)
const formatHour = (hour: number): string => {
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:00 ${suffix}`
}

// Format time range for display
const formatTimeRange = (start: string, end: string): string => {
  return `${start} - ${end}`
}

// Calculate position and height of schedule items
const getScheduleStyle = (schedule: Schedule): Record<string, string> => {
  // Parse start and end times
  const [startHour, startMinute] = schedule.startTime.split(':').map(Number)
  const [endHour, endMinute] = schedule.endTime.split(':').map(Number)

  // Calculate position from top (in rem)
  const topPosition = (startHour - props.startHour) * 6 + (startMinute / 60) * 6

  // Calculate duration in hours
  const durationHours = endHour - startHour + (endMinute - startMinute) / 60
  const height = durationHours * 6

  // Calculate left position based on teacher column
  const teacherIndex = props.teachers.findIndex((t) => t.id === schedule.teacherId)
  const leftPosition = 6 + (teacherIndex * 100) / props.teachers.length + '%'
  const width = `calc(${100 / props.teachers.length}% - 8px)`

  return {
    top: `${topPosition}rem`,
    height: `${height}rem`,
    left: leftPosition,
    width: width,
  }
}

// Get color class based on schedule index or type
const getScheduleClass = (index: number): string => {
  const colors: string[] = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-yellow-100 text-yellow-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
  ]

  return colors[index % colors.length]
}
</script>
