<script setup lang="ts">
import { Check, X, RefreshCw } from 'lucide-vue-next'

defineProps<{
  status?: string
  isRescheduled?: number
}>()
</script>

<template>
  <RefreshCw v-if="isRescheduled === 1" class="text-yellow-700" />
  <Check v-if="status === 'done'" class="text-green-700" />
  <X v-else-if="status === 'canceled'" class="text-red-700" />
</template>
