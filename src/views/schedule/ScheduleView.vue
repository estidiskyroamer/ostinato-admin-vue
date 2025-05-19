<script setup lang="ts">
import Header from '@/components/Header.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { provide } from 'vue'
import { Schedule } from './Schedule'
import ScheduleListView from './views/ScheduleListView.vue'
import ScheduleTableView from './views/ScheduleTableView.vue'

const {
  teachers,
  students,
  instruments,
  table,
  scheduleList,
  currentDateRef,
  isLoading,
  isFormDataLoading,
  getCurrentSchedule,
} = Schedule()
provide('teachers', teachers)
provide('students', students)
provide('instruments', instruments)
</script>

<template>
  <main class="flex flex-col h-screen w-full items-center">
    <Header />
    <div class="flex flex-row gap-4 w-full">
      <div class="flex-4 flex-col">
        <Card>
          <CardContent>
            <Calendar v-model="currentDateRef" />
          </CardContent>
        </Card>
      </div>
      <Card class="flex-1">
        <CardHeader>
          <CardTitle
            ><div class="flex items-center justify-between">
              <h2 class="text-xl font-bold">Schedules</h2>
            </div></CardTitle
          >
        </CardHeader>
        <CardContent>
          <Tabs default-value="list">
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="timetable">Timetable</TabsTrigger>
            </TabsList>
            <TabsContent value="list"
              ><ScheduleListView
                :table="table"
                :refresh="getCurrentSchedule"
                :is-form-data-loading="isFormDataLoading"
                :is-loading="isLoading"
            /></TabsContent>
            <TabsContent value="timetable"
              ><ScheduleTableView
                :teacher-data="teachers"
                :schedule-data="scheduleList"
                :start-time="'08:00'"
                :end-time="'21:00'"
                :refresh="getCurrentSchedule"
                :is-form-data-loading="isFormDataLoading"
                :is-loading="isLoading"
            /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  </main>
</template>
