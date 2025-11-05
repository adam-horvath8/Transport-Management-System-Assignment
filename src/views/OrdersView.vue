<template>
  <section class="flex flex-col gap-6">
    <h1 class="text-4xl font-bold text-blue-700 flex justify-center">Orders</h1>

    <div class="flex flex-col items-center justify-center gap-2">
      <div class="flex gap-2">
        <InputBar
          type="text"
          id="search"
          v-model="search"
          placeholder="Search based on customer name"
          class="w-full max-w-md self-center bg-gray-100 p-2 rounded-full"
        />

        <ButtonBase
          v-if="!isFilterActive"
          type="button"
          kind="icon"
          variant="blue"
          @click="handleSearch"
          class="shrink-0"
        >
          <MagnifyingGlass class="size-6" />
        </ButtonBase>

        <ButtonBase
          v-else
          type="button"
          kind="icon"
          variant="red"
          @click="isFilterActive = false"
          class="shrink-0"
          ><XmarkCircle
        /></ButtonBase>
      </div>

      <div class="flex gap-2">
        <InputBar type="checkbox" id="due-soon-checkbox" class="size-6" v-model="isDueSoon" />

        <label for="due-soon-checkbox">Due Soon</label>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
      <OrderCard v-for="order in orders" :key="order.id" :order="order" />
    </div>

    <SpinnerBase v-if="loading" size="xl" class="mx-auto" />
  </section>
</template>

<script setup lang="ts">
import InputBar from '@/components/base/InputBar.vue'
import SpinnerBase from '@/components/base/SpinnerBase.vue'
import OrderCard from '@/components/OrderCard.vue'
import { onMounted, ref, watch } from 'vue'
import { useToastMessageStore } from '@/stores/toast'
import type { Order } from '@/types'
import ButtonBase from '@/components/base/ButtonBase.vue'
import MagnifyingGlass from '@/components/icons/MagnifyingGlass.vue'
import XmarkCircle from '@/components/icons/XmarkCircle.vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const toastMessageStore = useToastMessageStore()

const orders = ref<Order[]>([])
const loading = ref(true)
const search = ref('')
const isDueSoon = ref(false)
const isFilterActive = ref(false)

onMounted(() => {
  fetchOrders()
})

const fetchOrders = async () => {
  try {
    loading.value = true

    const response = await fetch('http://localhost:3001/orders')

    if (!response.ok) throw Error('Something went wrong!')

    const reversedOrders = await response.json()
    orders.value = reversedOrders.reverse()
  } catch (error) {
    if (error) {
      toastMessageStore.setMessage('Something went wrong!', 'error')
    }
  } finally {
    loading.value = false
  }
}

watch(
  () => isFilterActive.value,
  (newValue) => {
    if (!newValue) {
      fetchOrders()

      search.value = ''
      isDueSoon.value = false
    }
  },
)

const handleSearch = () => {
  console.log(isDueSoon.value)

  isFilterActive.value = true
  orders.value = orders.value.filter((order) => order.customer_name.includes(search.value))

  if (isDueSoon.value) {
    orders.value = orders.value.sort((a, b) => {
      const dateA = dayjs.utc(a.date).valueOf()
      const dateB = dayjs.utc(b.date).valueOf()
      return dateA - dateB
    })
  }
}
</script>
