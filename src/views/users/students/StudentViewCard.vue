<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { User } from '@/interfaces/user'
import { House, Mail, Phone } from 'lucide-vue-next'

defineProps<{
  user: User
}>()
</script>

<template>
  <HoverCard>
    <HoverCardTrigger class="font-bold">{{ user.name }}</HoverCardTrigger>
    <HoverCardContent class="flex flex-col w-auto"
      ><div class="flex flex-row gap-4 py-2"><Phone :size="18" /> {{ user.phoneNumber }}</div>
      <div class="flex flex-row gap-4 py-2">
        <Mail :size="18" /><a :href="'mailto:' + user.email">{{ user.email }}</a>
      </div>
      <div class="flex flex-row gap-4 py-2">
        <House :size="18" /> {{ user.address ?? '-' }}
      </div></HoverCardContent
    >
  </HoverCard>
</template>
