<template>
  <article
    class="bg-white rounded-lg shadow-lg overflow-hidden relative transition-all duration-300 hover:scale-102 active:scale-98 cursor-pointer"
  >
    <RouterLink
      :to="{ name: 'order', params: { id: order.id } }"
      class="absolute inset-0 z-10"
    ></RouterLink>

    <header class="bg-blue-600 p-4 text-white">
      <h2 class="text-xl font-bold">Order #{{ order.number }}</h2>
    </header>

    <div class="p-4">
      <div class="flex flex-col gap-3 mb-4">
        <div class="flex flex-col gap-1">
          <p class="text-gray-600 text-sm font-semibold">Customer Name</p>

          <p class="text-base">{{ order.customer_name }}</p>
        </div>

        <div class="flex flex-col gap-1">
          <p class="text-gray-600 text-sm font-semibold">Date</p>

          <p class="text-base">{{ formatDate(order.date) }}</p>
        </div>
      </div>

      <div class="flex flex-col gap-2 pt-3 border-t border-gray-200">
        <p class="text-gray-600 text-sm font-semibold">Waypoints</p>

        <div v-if="order.waypoints.length > 0" class="flex flex-wrap gap-2">
          <span
            v-for="(waypoint, index) in order.waypoints.slice(0, 3)"
            :key="waypoint.id"
            class="px-2 py-1 rounded-full text-xs font-semibold text-white"
            :class="waypoint.type === 'pickup' ? 'bg-green-500' : 'bg-blue-500'"
          >
            {{ index + 1 }}. {{ waypoint.type === 'pickup' ? 'Pickup' : 'Delivery' }}
          </span>

          <span
            v-if="order.waypoints.length > 3"
            class="px-2 py-1 rounded-full text-xs font-semibold bg-gray-400 text-white"
          >
            +{{ order.waypoints.length - 3 }} more
          </span>
        </div>

        <p v-else class="text-gray-500 text-sm">No waypoints</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Order } from '@/types'
import { useDate } from '@/composables/useDate'

const { formatDate } = useDate()

defineProps<{
  order: Order
}>()
</script>
