<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { ExtractPropTypes } from 'vue'

type ButtonProps = ExtractPropTypes<typeof Button>
type VariantType = ButtonProps['variant']

const props = withDefaults(
  defineProps<{
    hintText: string
    variant?: VariantType
    onClick?: () => void
  }>(),
  {
    variant: 'ghost',
  },
)

const emit = defineEmits(['click'])

const onClick = () => {
  if (props.onClick) {
    emit('click')
  }
}
</script>
<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Button :variant="props.variant" :size="'icon'" @click="onClick">
          <slot />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{{ props.hintText }}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
