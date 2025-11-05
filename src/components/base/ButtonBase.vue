<template>
  <component
    :is="elementTag"
    :class="
      twMerge(
        'text-white rounded-full cursor-pointer flex items-center justify-center gap-2',
        variantClass,
        kindClass,
        props.class,
      )
    "
    active-class="bg-blue-700 outline outline-4 outline-white"
    exact-active-class="bg-blue-700 outline outline-4 outline-white"
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
  variant?: 'blue' | 'gray' | 'red' | 'green'
  kind?: 'icon'
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

const variantClass = computed(() => {
  switch (props.variant) {
    case 'blue':
      return 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600 disabled:opacity-50'
    case 'gray':
      return 'bg-gray-500 hover:bg-gray-600 disabled:bg-gray-500 disabled:opacity-50'
    case 'red':
      return 'bg-red-500 hover:bg-red-600 disabled:bg-red-500 disabled:opacity-50'
    case 'green':
      return 'bg-green-500 hover:bg-green-600 disabled:bg-green-500 disabled:opacity-50'
    default:
      return 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600 disabled:opacity-50'
  }
})

const kindClass = computed(() => {
  switch (props.kind) {
    case 'icon':
      return 'size-10 p-0'
    default:
      return 'px-4 py-2'
  }
})
</script>
