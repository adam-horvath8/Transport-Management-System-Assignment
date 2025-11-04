<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
    <OrderCard v-for="order in data" :key="order.id" :order="order" />
  </div>
</template>

<script setup lang="ts">
import OrderCard from '@/components/OrderCard.vue'
import { onMounted, ref } from 'vue'

const data = ref()

onMounted(async () => {
  const response = await fetch('http://localhost:3001/orders')
  console.log(response)

  if (response.ok) {
    console.log('fdfs')

    data.value = await response.json()
    console.log(data.value)
  }
})
</script>
