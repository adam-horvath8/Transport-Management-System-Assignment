<template>
  <component
    :is="elementTag"
    :class="
      twMerge(
        'px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-500 disabled:opacity-50',
        props.class,
      )
    "
    active-class="bg-blue-600"
    exact-active-class="bg-blue-600"
    :disabled="disabled"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { computed, resolveComponent, type HTMLAttributes } from 'vue'

const props = defineProps<{
  elementType?: 'button' | 'link'
  class?: HTMLAttributes['class']
  disabled?: boolean
}>()

const elementTag = computed(() => {
  switch (props.elementType) {
    case 'button':
      return 'button'
    case 'link':
      return resolveComponent('RouterLink')
    default:
      return 'button'
  }
})
</script>
