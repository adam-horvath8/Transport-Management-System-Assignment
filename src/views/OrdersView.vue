<template>
  <section class="flex flex-col gap-6 max-w-screen-2xl mx-auto">
    <h1 class="text-4xl font-bold text-blue-800 flex justify-center">Orders</h1>

    <form @submit.prevent="handleSearch" class="flex items-center gap-4 flex-wrap justify-center">
      <!-- Search input -->
      <InputBar
        type="text"
        id="search"
        v-model="search"
        placeholder="Customer Name"
        class="w-full max-w-xs bg-gray-100 p-2 rounded-full"
      />

      <!-- Date Filter -->
      <select
        v-model="dateFilter"
        class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
      >
        <option value="all">All</option>
        <option value="today">Today</option>
        <option value="this-week">This Week</option>
        <option value="this-month">This Month</option>
        <option value="next-week">Next Week</option>
        <option value="next-month">Next Month</option>
      </select>

      <!-- Due soon -->
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" class="size-5" v-model="isDueSoon" />
        Due Soon
      </label>

      <!-- Search button -->
      <ButtonBase type="submit" kind="icon" variant="blue" class="shrink-0">
        <MagnifyingGlass class="size-6" />
      </ButtonBase>

      <!-- Reset filter button -->
      <ButtonBase
        v-if="isFilterActive"
        type="button"
        kind="icon"
        variant="red"
        @click="isFilterActive = false"
        class="shrink-0"
      >
        <XmarkCircle />
      </ButtonBase>
    </form>

    <div
      v-if="orders.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8"
    >
      <OrderCard v-for="order in orders" :key="order.id" :order="order" />
    </div>

    <p v-else class="text-gray-600 text-xl text-center">No data found</p>

    <SpinnerBase v-if="loading" size="xl" class="mx-auto" />
  </section>
</template>

<script setup lang="ts">
import InputBar from '@/components/base/InputBar.vue'
import SpinnerBase from '@/components/base/SpinnerBase.vue'
import OrderCard from '@/components/order/OrderCard.vue'
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
const dateFilter = ref('all')
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
      dateFilter.value = 'all'
    }
  },
)

const filterByDate = (order: Order): boolean => {
  if (dateFilter.value === 'all') return true

  const orderDate = dayjs.utc(order.date).startOf('day')
  const today = dayjs.utc().startOf('day')

  switch (dateFilter.value) {
    case 'today':
      return orderDate.isSame(today)

    case 'this-week':
      const startOfWeek = today.startOf('week')
      const endOfWeek = today.endOf('week')
      return (
        (orderDate.isAfter(startOfWeek) || orderDate.isSame(startOfWeek)) &&
        (orderDate.isBefore(endOfWeek) || orderDate.isSame(endOfWeek))
      )

    case 'this-month':
      const startOfMonth = today.startOf('month')
      const endOfMonth = today.endOf('month')
      return (
        (orderDate.isAfter(startOfMonth) || orderDate.isSame(startOfMonth)) &&
        (orderDate.isBefore(endOfMonth) || orderDate.isSame(endOfMonth))
      )

    case 'next-week':
      const nextWeekStart = today.add(1, 'week').startOf('week')
      const nextWeekEnd = today.add(1, 'week').endOf('week')
      return (
        (orderDate.isAfter(nextWeekStart) || orderDate.isSame(nextWeekStart)) &&
        (orderDate.isBefore(nextWeekEnd) || orderDate.isSame(nextWeekEnd))
      )

    case 'next-month':
      const nextMonthStart = today.add(1, 'month').startOf('month')
      const nextMonthEnd = today.add(1, 'month').endOf('month')
      return (
        (orderDate.isAfter(nextMonthStart) || orderDate.isSame(nextMonthStart)) &&
        (orderDate.isBefore(nextMonthEnd) || orderDate.isSame(nextMonthEnd))
      )

    default:
      return true
  }
}

// For the purpose of this assignment the filtering is done in the frontend
const handleSearch = async () => {
  await fetchOrders()

  orders.value = orders.value.filter((order) =>
    order.customer_name.toLowerCase().includes(search.value.toLowerCase()),
  )

  orders.value = orders.value.filter(filterByDate)

  if (isDueSoon.value) {
    orders.value = orders.value.sort((a, b) => {
      const dateA = dayjs.utc(a.date).valueOf()
      const dateB = dayjs.utc(b.date).valueOf()
      return dateA - dateB
    })
  }

  isFilterActive.value = true
}
</script>
