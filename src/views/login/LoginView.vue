<script setup lang="ts">
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Toaster from '@/components/ui/toast/Toaster.vue'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Loader2 } from 'lucide-vue-next'
import { createLoginForm } from './Login'

const { onSubmit, isLoading } = createLoginForm();
</script>

<template>
  <div class="flex h-screen w-full items-center justify-center">
    <Toaster />
      <Card class="w-max">
      <CardHeader>
          <CardTitle>Login to Ostinato</CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col gap-8">
          <form @submit="onSubmit" class="flex flex-col gap-4">
              <FormField v-slot="{ componentField }" name="email">
                  <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                          <Input id="email" type="email" placeholder="Email" v-bind="componentField" required />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="password">
                  <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                          <Input id="password" type="password" placeholder="Password" v-bind="componentField" required />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              </FormField>
              
              <Button type="submit" :disabled="isLoading">
                <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
                Log in
              </Button>
          </form>
          <a href="#">Forgot password?</a>
      </CardContent>
    </Card>
  </div>
</template>