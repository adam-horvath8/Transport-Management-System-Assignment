<template>
  <div class="flex flex-wrap gap-2">
    <span
      v-for="(waypoint, index) in waypoints.slice(0, 3)"
      :key="waypoint.id"
      class="px-2 py-1 rounded-full text-xs font-semibold text-white"
      :class="waypoint.type === 'pickup' ? 'bg-indigo-400' : 'bg-orange-400'"
    >
      {{ index + 1 }}. {{ waypoint.type === 'pickup' ? 'Pickup' : 'Delivery' }}
    </span>

    <span
      v-if="waypoints.length > 3"
      class="px-2 py-1 rounded-full text-xs font-semibold bg-gray-400 text-white"
    >
      +{{ waypoints.length - 3 }} more
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Waypoint } from '@/types'

defineProps<{
  waypoints: Waypoint[]
}>()
</script>
