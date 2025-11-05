<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="(waypoint, index) in waypoints"
      :key="waypoint.id"
      class="bg-gray-100 p-4 rounded-lg relative"
    >
      <div class="flex items-center gap-2 mb-2">
        <span
          :class="[
            'px-3 py-1 rounded-full text-sm font-semibold text-white',
            waypoint.type === 'pickup' ? 'bg-indigo-400' : 'bg-orange-400',
          ]"
        >
          {{ index + 1 }}. {{ waypoint.type === 'pickup' ? 'Pickup' : 'Delivery' }}
        </span>
      </div>

      <p class="text-gray-700">{{ waypoint.location_address }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Waypoint } from '@/types'

defineProps<{
  waypoints: Waypoint[]
}>()
</script>
