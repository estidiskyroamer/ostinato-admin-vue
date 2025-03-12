<script setup lang="ts">
import Header from '@/components/Header.vue';
import StudentView from './StudentView.vue';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
</script>

<template>
    <main class="flex flex-col h-screen w-full items-center">
      <Header />    
      <Card class="w-full">
        <CardHeader>
            <CardTitle class="text-xl">Users</CardTitle>
        </CardHeader>
        <CardContent>
            <Tabs default-value="admins">
                <TabsList>
                    <TabsTrigger value="admins">Admins</TabsTrigger>
                    <TabsTrigger value="teachers">Teachers</TabsTrigger>
                    <TabsTrigger value="students">Students</TabsTrigger>
                </TabsList>
                <TabsContent value="admins"></TabsContent>
                <TabsContent value="teachers"></TabsContent>
                <TabsContent value="students"><StudentView /></TabsContent>
            </Tabs>
        </CardContent>
        </Card>
    </main>
</template>