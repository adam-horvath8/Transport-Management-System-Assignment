<template>
  <section class="flex items-center justify-center flex-col gap-6 max-w-7xl mx-auto">
    <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
      <SpinnerBase size="xl" />
    </div>

    <div v-else-if="order" class="w-full flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <ButtonBase elementType="link" :to="{ name: 'orders' }" variant="gray">
          <LeftArrowCircle /> Back to Orders
        </ButtonBase>
      </div>

      <article class="bg-white rounded-lg shadow-lg overflow-hidden">
        <header class="bg-blue-600 p-6 text-white">
          <h1 class="text-3xl font-bold">Order #{{ order.number }}</h1>
        </header>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="flex flex-col gap-2">
              <p class="text-gray-600 font-semibold">Customer Name</p>
              <p class="text-lg">{{ order.customer_name }}</p>
            </div>

            <div class="flex flex-col gap-2">
              <p class="text-gray-600 font-semibold">Date</p>
              <p class="text-lg">{{ formatDate(order.date) }}</p>
            </div>

            <div class="flex flex-col gap-2">
              <p class="text-gray-600 font-semibold">Order ID</p>
              <p class="text-lg font-mono text-gray-700">{{ order.id }}</p>
            </div>

            <div class="flex flex-col gap-2">
              <p class="text-gray-600 font-semibold">Total Waypoints</p>
              <p class="text-lg">{{ order.waypoints.length }}</p>
            </div>
          </div>

          <div v-if="order.waypoints.length > 0" class="mt-8">
            <h2 class="text-2xl font-bold text-blue-700 mb-4">Waypoints</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="(waypoint, index) in order.waypoints"
                :key="waypoint.id"
                class="bg-gray-100 p-4 rounded-lg relative"
              >
                <div class="flex items-center gap-2 mb-2">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-semibold text-white',
                      waypoint.type === 'pickup' ? 'bg-green-500' : 'bg-blue-500',
                    ]"
                  >
                    {{ index + 1 }}. {{ waypoint.type === 'pickup' ? 'Pickup' : 'Delivery' }}
                  </span>
                </div>
                <p class="text-gray-700">{{ waypoint.location_address }}</p>
              </div>
            </div>
          </div>

          <div v-else class="mt-8 p-6 bg-gray-100 rounded-lg text-center">
            <p class="text-gray-600">No waypoints for this order</p>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-600 text-lg">Order not found</p>
      <ButtonBase elementType="link" :to="{ name: 'orders' }" class="mt-4">
        Go to Orders
      </ButtonBase>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Order } from '@/types'
import ButtonBase from '@/components/base/ButtonBase.vue'
import SpinnerBase from '@/components/base/SpinnerBase.vue'
import LeftArrowCircle from '@/components/icons/LeftArrowCircle.vue'

const route = useRoute()
const order = ref<Order | null>(null)
const loading = ref(true)

const fetchOrder = async () => {
  try {
    loading.value = true
    const response = await fetch(`http://localhost:3001/orders/${route.params.id}`)

    if (!response.ok) {
      if (response.status === 404) {
        order.value = null
        return
      }
      throw Error('Something went wrong!')
    }

    order.value = await response.json()
  } catch (error) {
    console.error(error)
    order.value = null
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

onMounted(() => {
  fetchOrder()
})
</script>
