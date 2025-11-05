<template>
  <article
    class="bg-white rounded-lg shadow-lg overflow-hidden relative transition-all duration-300 hover:scale-102 active:scale-98 cursor-pointer"
  >
    <RouterLink
      :to="{ name: 'order', params: { id: order.id } }"
      class="absolute inset-0 z-10"
    ></RouterLink>

    <header class="bg-blue-700 p-4 text-white">
      <h2 class="text-xl font-bold">Order #{{ order.number }}</h2>
    </header>

    <div class="p-4">
      <div class="flex flex-col gap-3 mb-4">
        <DataCell label="Customer Name" :value="order.customer_name" />

        <DataCell label="Date" :value="formatDate(order.date)" />
      </div>

      <div class="flex flex-col gap-2 pt-3 border-t border-gray-200">
        <p class="text-gray-600 text-sm font-semibold">
          Waypoints

          <span class="text-gray-500 text-sm font-normal" v-if="order.waypoints.length > 0"
            >({{ order.waypoints.length }})</span
          >
        </p>

        <WaypointsBadges v-if="order.waypoints.length > 0" :waypoints="order.waypoints" />

        <p v-else class="text-gray-500 text-sm">No waypoints</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Order } from '@/types'
import { useDate } from '@/composables/useDate'
import WaypointsBadges from './WaypointsBadges.vue'
import DataCell from './DataCell.vue'

const { formatDate } = useDate()

defineProps<{
  order: Order
}>()
</script>
