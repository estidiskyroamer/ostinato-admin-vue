<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>

<template>
  <main class="flex h-screen w-full px-4">
    <RouterView />
    <Toaster />
  </main>
</template>
