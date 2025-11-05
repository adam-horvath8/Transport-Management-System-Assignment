<template>
  <input
    :type="type"
    :id="id"
    :value="displayValue"

    @input="handleInput"
    :class="
      twMerge(
        'bg-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg',
        props.class,
      )
    "
  />
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const props = defineProps<{
  type: string
  id: string
  class?: HTMLAttributes['class']
}>()

const model = defineModel<number | string | null | boolean>()

const displayValue = computed(() => {
  if (props.type === 'date' && model.value && typeof model.value === 'string') {
    try {
      return dayjs(model.value).format('YYYY-MM-DD')
    } catch {
      return ''
    }
  }

  return model.value ?? ''
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value

  if (!value) {
    model.value = null
    return
  }

  if (props.type === 'date') {
    model.value = dayjs.utc(value).toISOString()
  } else {
    model.value = value
  }
}
</script>
