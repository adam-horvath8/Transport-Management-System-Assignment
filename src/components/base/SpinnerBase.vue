<template>
  <div class="flex justify-center items-center">
    <div
      class="animate-spin rounded-full border-t-4 border-b-4 border-blue-600"
      :class="twMerge(sizeClass, variantClass, props.class)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { computed, type HTMLAttributes } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | 'xl'
    variant?: 'blue' | 'white'
    class?: HTMLAttributes['class']
  }>(),
  {
    size: 'md',
    variant: 'blue',
  },
)

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-4 w-4'
    case 'md':
      return 'h-8 w-8'
    case 'lg':
      return 'h-12 w-12'
    case 'xl':
      return 'h-16 w-16'
    default:
      return 'h-8 w-8'
  }
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'blue':
      return 'border-blue-600'
    case 'white':
      return 'border-white'
    default:
      return 'border-blue-600'
  }
})
</script>
