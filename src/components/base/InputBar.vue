<template>
  <input
    :type="type"
    :id="id"
    v-model="model"
    :class="
      twMerge(
        'bg-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg',
        props.class,
      )
    "
  />
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  type: string
  id: string
  class?: HTMLAttributes['class']
}>()

const model = defineModel<number | string | null>()
</script>
