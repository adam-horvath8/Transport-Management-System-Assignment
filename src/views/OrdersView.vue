<template>
  <section class="flex flex-col gap-6">
    <h1 class="text-4xl font-bold text-blue-700 flex justify-center">Orders</h1>

    <InputBar
      type="text"
      id="search"
      v-model="search"
      placeholder="Search orders"
      class="w-full max-w-md self-center bg-gray-100 p-2 rounded-lg"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
      <OrderCard v-for="order in data" :key="order.id" :order="order" />
    </div>

    <SpinnerBase v-if="loading" size="xl" class="mx-auto" />
  </section>
</template>

<script setup lang="ts">
import InputBar from '@/components/base/InputBar.vue'
import SpinnerBase from '@/components/base/SpinnerBase.vue'
import OrderCard from '@/components/OrderCard.vue'
import { onMounted, ref } from 'vue'

const data = ref()
const loading = ref(true)
const search = ref('')

onMounted(async () => {
  try {
    loading.value = true

    const response = await fetch('http://localhost:3001/orders')

    if (!response.ok) throw Error('Something went wrong!')

    data.value = await response.json()
  } catch (error) {
    if (error) {
      console.log(error)
    }
  } finally {
    loading.value = false
  }
})
</script>
