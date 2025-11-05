<template>
  <div class="flex flex-col gap-2">
    <p class="text-gray-600 font-semibold">{{ label }}</p>

    <p class="text-lg">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string
}>()
</script>
