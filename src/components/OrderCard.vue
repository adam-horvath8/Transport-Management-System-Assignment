<template>
  <article
    class="p-4 bg-white rounded-md shadow-lg relative transition-all duration-300 hover:scale-102 active:scale-98"
  >
    <RouterLink :to="`/order/${order.id}`" class="absolute inset-0"></RouterLink>

    <header class="flex justify-between items-center bg-blue-600 p-2 rounded-md text-white">
      <h2>Order #{{ order.number }}</h2>
    </header>

    <div class="grid grid-cols-2 py-2 gap-2">
      <p>Customer Name:</p>
      <p>{{ order.customer_name }}</p>

      <p>Date:</p>
      <p>{{ order.date }}</p>

      <p>Waypoints:</p>
      <p v-if="order.waypoints.length > 0">{{ order.waypoints.length }}</p>
      <p v-else>No waypoints</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Order } from '@/types'

const props = defineProps<{
  order: Order
}>()

console.log(props.order)
</script>
