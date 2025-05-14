<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const props = withDefaults(
  defineProps<{
    title: string
    content?: string
    actionText: string
    action?: () => void
    refresh?: () => void
  }>(),
  {
    content: '',
  },
)

const confirmAction = () => {
  if (props.action) props.action()
  if (props.refresh) props.refresh()
}
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger><slot /></AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ props.title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ props.content }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction @click="confirmAction">{{ props.actionText }}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
