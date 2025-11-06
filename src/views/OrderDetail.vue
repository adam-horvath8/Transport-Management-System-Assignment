<template>
  <section class="flex items-center justify-center flex-col gap-6 max-w-7xl mx-auto">
    <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
      <SpinnerBase size="xl" />
    </div>

    <div v-else-if="orderStore.order" class="w-full flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <ButtonBase elementType="link" :to="{ name: 'orders' }" variant="gray">
          <LeftArrowCircle /> Back to Orders
        </ButtonBase>
      </div>

      <article class="bg-white rounded-lg shadow-lg overflow-hidden">
        <header class="bg-blue-700 p-6 text-white">
          <h1 class="text-3xl font-bold">Order #{{ orderStore.order?.number ?? '' }}</h1>
        </header>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <DataCell label="Customer Name" :value="orderStore.order?.customer_name ?? ''" />

            <DataCell label="Date" :value="formatDate(orderStore.order?.date ?? '')" />

            <DataCell
              v-if="orderStore.order?.id"
              label="Order ID"
              :value="orderStore.order?.id ?? ''"
            />

            <DataCell
              v-if="orderStore.order?.waypoints.length"
              label="Total Waypoints"
              :value="orderStore.order?.waypoints.length.toString()"
            />
          </div>

          <div v-if="orderStore.order?.waypoints.length > 0" class="mt-8">
            <h2 class="text-2xl font-bold text-blue-800 mb-4">Waypoints</h2>

            <WaypointCell :waypoints="orderStore.order?.waypoints ?? []" />
          </div>

          <div v-else class="mt-8 p-6 bg-gray-100 rounded-lg text-center">
            <p class="text-gray-600">No waypoints for this order</p>
          </div>
        </div>
      </article>

      <div class="flex gap-4 self-center">
        <ButtonBase
          elementType="link"
          :to="{ name: 'edit-order', params: { id: orderStore.order?.id } }"
        >
          <PenEdit /> Edit
        </ButtonBase>

        <ButtonBase @click="isConfirmDeleteModalOpen = true" variant="red">
          <XmarkCircle />
          Delete Order
        </ButtonBase>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-600 text-lg">Order not found</p>

      <ButtonBase elementType="link" :to="{ name: 'orders' }" class="mt-4">
        Go to Orders
      </ButtonBase>
    </div>

    <ConfirmDeleteModal v-model="isConfirmDeleteModalOpen" @confirm="deleteOrder" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ButtonBase from '@/components/base/ButtonBase.vue'
import SpinnerBase from '@/components/base/SpinnerBase.vue'
import LeftArrowCircle from '@/components/icons/LeftArrowCircle.vue'
import XmarkCircle from '@/components/icons/XmarkCircle.vue'
import { useToastMessageStore } from '@/stores/toast'
import ConfirmDeleteModal from '@/components/base/ConfirmDeleteModal.vue'
import { useDate } from '@/composables/useDate'
import DataCell from '@/components/order/DataCell.vue'
import WaypointCell from '@/components/order/WaypointCell.vue'
import PenEdit from '@/components/icons/PenEdit.vue'
import { useOrderStore } from '@/stores/order'

const { formatDate } = useDate()
const toastMessageStore = useToastMessageStore()
const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const loading = ref(true)
const isConfirmDeleteModalOpen = ref(false)

const fetchOrder = async () => {
  try {
    loading.value = true
    const response = await fetch(`http://localhost:3001/orders/${route.params.id}`)

    if (!response.ok) {
      if (response.status === 404) {
        orderStore.clearOrderData()
        return
      }
      throw Error('Something went wrong!')
    }

    orderStore.setOrderData(await response.json())
  } catch (error) {
    if (error) {
      toastMessageStore.setMessage('Something went wrong!', 'error')
    }
    orderStore.clearOrderData()
  } finally {
    loading.value = false
  }
}

const deleteOrder = async () => {
  try {
    const response = await fetch(`http://localhost:3001/orders/${route.params.id}`, {
      method: 'DELETE',
    })

    if (!response.ok) throw Error('Something went wrong!')

    toastMessageStore.setMessage('Order deleted succsessfully', 'success')
    router.push('/')
  } catch (error) {
    if (error) {
      toastMessageStore.setMessage('Something went wrong!', 'error')
    }
  }
}

onMounted(() => {
  fetchOrder()
})
</script>
